/**
 * Factory for subject-matter semantic screening (Gemini).
 * Fails open when key missing / API errors.
 */

import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { HARD_LIMITS } from "./apiUsageGuard";

const MODEL = "gemini-3.5-flash-lite";
const FALLBACK_MODELS = ["gemini-3.1-flash-lite", "gemini-3.5-flash"];
const ATTEMPT_TIMEOUT_MS = 7000;

const CATEGORIES = [
  "genuine_inquiry",
  "brief_but_plausible",
  "low_value",
  "spam_or_solicitation",
  "troll_or_abusive",
  "gibberish",
  "test_submission",
] as const;

type Category = (typeof CATEGORIES)[number];

const REJECT_THRESHOLD = 60;
const REJECTABLE = new Set<string>([
  "spam_or_solicitation",
  "troll_or_abusive",
  "gibberish",
  "test_submission",
]);

const BLOCKED_FINISH_REASONS = new Set([
  "SAFETY", "PROHIBITED_CONTENT", "BLOCKLIST", "SPII", "IMAGE_SAFETY",
]);

const VERDICT_SCHEMA = {
  type: "object",
  properties: {
    category: { type: "string", enum: [...CATEGORIES] },
    confidence: { type: "integer", minimum: 0, maximum: 100 },
    reason: { type: "string" },
    is_sales_pitch: { type: "boolean" },
  },
  required: ["category", "confidence", "reason", "is_sales_pitch"],
  additionalProperties: false,
  propertyOrdering: ["category", "confidence", "reason", "is_sales_pitch"],
};

export type ScreenVerdict = {
  decision: "accept" | "review" | "reject";
  category: string;
  confidence: number;
  reason: string;
  screened: boolean;
  isSalesPitch?: boolean;
};

export type ScreenerConfig = {
  businessName: string;
  systemPrompt: string;
  fieldOrder?: string[];
  freeTextKeys?: string[];
  envFlag?: string;
  apiKeyEnv?: string[];
};

function parseVerdict(text: string): Record<string, unknown> | null {
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    try {
      return match ? (JSON.parse(match[0]) as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }
}

function decide(category: string, confidence: number): ScreenVerdict["decision"] {
  if (REJECTABLE.has(category)) {
    return confidence >= REJECT_THRESHOLD ? "reject" : "review";
  }
  if (category === "low_value") return "review";
  return "accept";
}

const PASS = (category: string, reason: string): ScreenVerdict => ({
  decision: "accept", category, confidence: 0, reason, screened: false,
});

const HOLD = (reason: string): ScreenVerdict => ({
  decision: "review", category: "unscreened", confidence: 0, reason, screened: false,
});

export function createScreener(config: ScreenerConfig) {
  const {
    systemPrompt,
    fieldOrder = ["name", "email", "phone", "message"],
    freeTextKeys = ["message", "name"],
    envFlag = "CONTACT_SCREENING",
    apiKeyEnv = ["HT_GEMINI_API_KEY", "GEMINI_API_KEY", "GOOGLE_GEMINI_API_KEY", "GOOGLE_API_KEY"],
  } = config;

  function getKey(): string | null {
    for (const name of apiKeyEnv) {
      if (process.env[name]) return process.env[name] as string;
    }
    return null;
  }

  function buildPrompt(submission: Record<string, unknown>, signals: Record<string, unknown> = {}) {
    const field = (label: string, value: unknown) =>
      `${label}: ${value ? String(value) : "(not provided)"}`;
    const context = [
      field("Email looks deliverable", signals.emailOk == null ? null : String(signals.emailOk)),
      field("Phone verified", signals.phoneOk == null ? null : String(signals.phoneOk)),
      field("Approx location", signals.geo),
      field("Prior submissions this hour", String(signals.priorSubmissions ?? 0)),
      field("Mild profanity flag", String(Boolean(signals.mildProfanity))),
    ].join("\n");

    const body = fieldOrder.map((key) => field(key, submission[key])).join("\n");

    return `Screen this form submission.

<request_context>
${context}
</request_context>

<submission>
${body}
</submission>

Classify it.`;
  }

  return async function screenSubmission(
    submission: Record<string, unknown>,
    signals: Record<string, unknown> = {},
  ): Promise<ScreenVerdict> {
    if (process.env[envFlag] === "off") {
      return PASS("unscreened", "Screening disabled by configuration.");
    }

    const apiKey = getKey();
    if (!apiKey) {
      console.warn(`[${config.businessName}] Gemini key not set — screening skipped`);
      return PASS("unscreened", "Screening unavailable.");
    }

    const freeText = freeTextKeys
      .map((k) => submission[k])
      .filter(Boolean)
      .join(" ")
      .trim();
    if (!freeText) {
      return PASS("brief_but_plausible", "Contact details only — nothing to screen.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildPrompt(submission, signals);
    const deadline = Date.now() + HARD_LIMITS.SCREEN_TOTAL_BUDGET_MS;
    const attempts = [MODEL, ...FALLBACK_MODELS];
    let lastError: unknown = null;

    for (const model of attempts) {
      const remaining = deadline - Date.now();
      if (remaining <= 500) break;

      let response: Awaited<ReturnType<typeof ai.models.generateContent>>;
      try {
        response = await ai.models.generateContent({
          model,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseJsonSchema: VERDICT_SCHEMA,
            maxOutputTokens: HARD_LIMITS.SCREEN_MAX_OUTPUT_TOKENS,
            thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
            abortSignal: AbortSignal.timeout(Math.min(ATTEMPT_TIMEOUT_MS, remaining)),
          },
        });
      } catch (err) {
        lastError = err;
        console.warn(`Screening on ${model} failed:`, String((err as Error)?.message ?? err).slice(0, 140));
        continue;
      }

      const blockReason = response.promptFeedback?.blockReason;
      const finishReason = response.candidates?.[0]?.finishReason;
      if (blockReason || BLOCKED_FINISH_REASONS.has(String(finishReason))) {
        return {
          decision: "reject",
          category: "troll_or_abusive",
          confidence: 100,
          reason: `Content blocked by safety filters (${blockReason ?? finishReason}).`,
          screened: true,
        };
      }

      const verdict = response.text ? parseVerdict(response.text) : null;
      if (!verdict) {
        lastError = new Error("unreadable verdict");
        continue;
      }

      const rawCategory = String(verdict.category ?? "");
      const category: Category = (CATEGORIES as readonly string[]).includes(rawCategory)
        ? (rawCategory as Category)
        : "genuine_inquiry";
      const confidence = Math.max(0, Math.min(100, Number(verdict.confidence) || 0));

      return {
        decision: decide(category, confidence),
        category,
        confidence,
        reason: String(verdict.reason ?? "").slice(0, 300),
        isSalesPitch: Boolean(verdict.is_sales_pitch),
        screened: true,
      };
    }

    console.error(`[${config.businessName}] screening exhausted:`, (lastError as Error)?.message ?? lastError);
    return HOLD("Screening unavailable — flagged for manual review.");
  };
}
