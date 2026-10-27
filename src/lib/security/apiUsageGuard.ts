/**
 * Hardcoded usage limits for paid / AI API keys.
 * Env may only tighten limits — never raise above HARD_* ceilings.
 */

export const HARD_LIMITS = Object.freeze({
  FORM_PER_IP_HOUR: 8,
  FORM_MIN_GAP_MS: 30_000,
  CHAT_PER_IP_HOUR: 20,
  CHAT_MAX_INPUT_CHARS: 2_000,
  CHAT_MAX_MESSAGES: 20,
  CHAT_MAX_OUTPUT_TOKENS: 2_048,
  SCREEN_MAX_OUTPUT_TOKENS: 512,
  SCREEN_TOTAL_BUDGET_MS: 16_000,
  ADMIN_AI_PER_HOUR: 30,
  ADMIN_AI_MAX_OUTPUT_TOKENS: 1_200,
  ADMIN_COMMENT_MAX_TOKENS: 256,
  EMAIL_PER_IP_HOUR: 8,
  GLOBAL_AI_PER_HOUR: 200,
});

type Bucket = { count: number; resetAt: number; lastAt?: number };

const buckets = new Map<string, Bucket>();

function clampMax(requested: unknown, hardCeiling: number): number {
  const n = Number(requested);
  if (!Number.isFinite(n) || n <= 0) return hardCeiling;
  return Math.min(Math.floor(n), hardCeiling);
}

export type UsageResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  count: number;
};

export function checkUsage(
  key: string,
  maxRequests: number,
  windowMs = 60 * 60 * 1000,
): UsageResult {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  if (buckets.size > 8_000) {
    for (const [k, b] of buckets) {
      if (now >= b.resetAt) buckets.delete(k);
    }
  }

  return {
    allowed: bucket.count <= maxRequests,
    remaining: Math.max(0, maxRequests - bucket.count),
    resetAt: bucket.resetAt,
    count: bucket.count,
  };
}

export type GuardResult =
  | { ok: true; remaining: number }
  | { ok: false; status: number; error: string; code: string };

export function guardFormSubmission(
  ip: string,
  opts: { maxPerHour?: number; minGapMs?: number } = {},
): GuardResult {
  const max = clampMax(
    opts.maxPerHour ?? process.env.FORM_RATE_LIMIT_PER_HOUR,
    HARD_LIMITS.FORM_PER_IP_HOUR,
  );
  const minGap = clampMax(
    opts.minGapMs ?? process.env.FORM_MIN_GAP_MS,
    HARD_LIMITS.FORM_MIN_GAP_MS,
  );
  const hour = checkUsage(`form:${ip}`, max);
  if (!hour.allowed) {
    return { ok: false, status: 429, error: "Too many requests", code: "rate_limited" };
  }
  const gapKey = `form-gap:${ip}`;
  const last = buckets.get(gapKey);
  const now = Date.now();
  if (last?.lastAt && now - last.lastAt < minGap) {
    return { ok: false, status: 429, error: "Please wait before submitting again", code: "min_gap" };
  }
  buckets.set(gapKey, { count: 1, resetAt: now + minGap, lastAt: now });
  return { ok: true, remaining: hour.remaining };
}

export function guardPublicChat(
  ip: string,
  opts: { maxPerHour?: number } = {},
): GuardResult {
  const max = clampMax(opts.maxPerHour, HARD_LIMITS.CHAT_PER_IP_HOUR);
  const result = checkUsage(`chat:${ip}`, max);
  if (!result.allowed) {
    return { ok: false, status: 429, error: "Chat rate limit reached. Try again later.", code: "chat_rate_limited" };
  }
  const global = checkUsage("global-ai", HARD_LIMITS.GLOBAL_AI_PER_HOUR);
  if (!global.allowed) {
    return { ok: false, status: 503, error: "AI temporarily unavailable.", code: "global_ai_cap" };
  }
  return { ok: true, remaining: result.remaining };
}

export function guardAdminAi(
  identity: string,
  opts: { maxPerHour?: number } = {},
): GuardResult {
  const max = clampMax(opts.maxPerHour, HARD_LIMITS.ADMIN_AI_PER_HOUR);
  const result = checkUsage(`admin-ai:${identity}`, max);
  if (!result.allowed) {
    return { ok: false, status: 429, error: "AI usage limit reached for this hour.", code: "admin_ai_rate_limited" };
  }
  const global = checkUsage("global-ai", HARD_LIMITS.GLOBAL_AI_PER_HOUR);
  if (!global.allowed) {
    return { ok: false, status: 503, error: "AI temporarily unavailable.", code: "global_ai_cap" };
  }
  return { ok: true, remaining: result.remaining };
}

export function clampChatInput(text: unknown): string {
  return String(text ?? "").slice(0, HARD_LIMITS.CHAT_MAX_INPUT_CHARS);
}

export function chatOutputTokenCap(requested?: number): number {
  return clampMax(requested, HARD_LIMITS.CHAT_MAX_OUTPUT_TOKENS);
}

export function adminOutputTokenCap(requested?: number): number {
  return clampMax(requested, HARD_LIMITS.ADMIN_AI_MAX_OUTPUT_TOKENS);
}

export function getClientIpFromHeaders(headers: Headers | Record<string, string | string[] | undefined>): string {
  const get = (k: string): string | null => {
    if (typeof (headers as Headers).get === "function") {
      return (headers as Headers).get(k);
    }
    const rec = headers as Record<string, string | string[] | undefined>;
    const v = rec[k] ?? rec[k.toLowerCase()];
    if (Array.isArray(v)) return v[0] ?? null;
    return v ?? null;
  };
  const forwarded = get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return get("x-real-ip") || "unknown";
}
