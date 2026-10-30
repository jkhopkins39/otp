import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { insertContactSubmission } from "@/lib/site-store";
import { isSpamSubmission } from "@/lib/spam-guard";
import { getClientIpFromHeaders } from "@/lib/security/apiUsageGuard";
import {
  prefilter,
  hasMildProfanity,
  isOwnerTestSubmission,
  OWNER_TEST_SCREENING,
} from "@/lib/security/contentFilter";
import { createScreener } from "@/lib/security/createScreener";
import {
  enforceIpProtection,
  noteScreeningForIp,
} from "@/lib/security/ipProtection";
import { getSubjectPrompt } from "@/lib/security/subjectPrompts";

const contactSchema = z.object({
  full_name: z.string().trim().max(120).default(""),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(40),
  event_type: z.string().trim().max(120).default(""),
  event_date: z.string().trim().max(80).default(""),
  venue: z.string().trim().max(200).default(""),
  expected_attendance: z.string().trim().max(80).default(""),
  venue_type: z.string().trim().max(80).default(""),
  services: z.string().trim().max(500).default(""),
  setup_window: z.string().trim().max(120).default(""),
  budget_range: z.string().trim().max(120).default(""),
  referral_source: z.string().trim().max(120).default(""),
  additional_details: z.string().trim().max(5000).default(""),
});

const screenSubmission = createScreener({
  businessName: "One Talent Productions",
  systemPrompt: getSubjectPrompt("otp"),
  fieldOrder: [
    "full_name",
    "email",
    "phone",
    "event_type",
    "event_date",
    "venue",
    "expected_attendance",
    "venue_type",
    "services",
    "setup_window",
    "budget_range",
    "referral_source",
    "additional_details",
  ],
  freeTextKeys: ["additional_details", "full_name", "venue"],
});

// ── Email HTML builder ───────────────────────────────────────────

function buildEmailHtml(b: Record<string, string>): string {
  const row = (label: string, value: string) =>
    value
      ? `<tr>
           <td style="padding:6px 12px 6px 0;font-size:13px;color:#6b7280;white-space:nowrap;vertical-align:top">${label}</td>
           <td style="padding:6px 0;font-size:13px;color:#111827">${value}</td>
         </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:24px 32px">
      <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.8)">One Talent Productions</p>
      <h1 style="margin:4px 0 0;font-size:22px;font-weight:700;color:#fff">New Event Inquiry</h1>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px">
      <p style="margin:0 0 20px;font-size:14px;color:#374151">
        <strong>${b.full_name?.trim() || "Website visitor"}</strong> submitted an event request from the website.
      </p>

      <!-- Contact -->
      <h2 style="margin:0 0 10px;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#9ca3af">Contact</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        ${row("Email", `<a href="mailto:${b.email}" style="color:#d97706">${b.email}</a>`)}
        ${row("Phone", b.phone ? `<a href="tel:${b.phone}" style="color:#d97706">${b.phone}</a>` : "")}
      </table>

      <!-- Event -->
      <h2 style="margin:0 0 10px;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#9ca3af">Event Details</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        ${row("Type", b.event_type)}
        ${row("Date", b.event_date)}
        ${row("Venue", b.venue)}
        ${row("Attendance", b.expected_attendance)}
        ${row("Indoor / Outdoor", b.venue_type)}
      </table>

      <!-- Services & Logistics -->
      <h2 style="margin:0 0 10px;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#9ca3af">Services &amp; Logistics</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        ${row("Services needed", b.services)}
        ${row("Setup window", b.setup_window)}
        ${row("Budget range", b.budget_range)}
        ${row("Referral source", b.referral_source)}
      </table>

      ${
        b.additional_details
          ? `<h2 style="margin:0 0 8px;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#9ca3af">Additional Details</h2>
             <p style="margin:0;font-size:14px;color:#374151;line-height:1.6">${b.additional_details}</p>`
          : ""
      }
    </div>

    <!-- Footer -->
    <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb">
      <p style="margin:0;font-size:12px;color:#9ca3af">
        Submitted via onetalentproductions.com · Reply directly to this email to respond to ${b.full_name?.trim() || "the sender"}.
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ── Route handler ────────────────────────────────────────────────

export async function POST(req: Request) {
  const ip = getClientIpFromHeaders(req.headers);

  let body: Record<string, string | number>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (
    isSpamSubmission({
      _honey: String(body._honey ?? ""),
      formLoadTime:
        typeof body.formLoadTime === "number"
          ? body.formLoadTime
          : Number(body.formLoadTime) || undefined,
    })
  ) {
    return NextResponse.json({ success: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const submission = parsed.data;
  const ownerTest = isOwnerTestSubmission(submission);

  // Owner tests (Jeremy) skip the IP rate limit so rapid local testing still emails.
  if (!ownerTest) {
    const usage = await enforceIpProtection({ site: "otp", ip });
    if (!usage.ok) {
      if (usage.code === "ip_blocked") {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: usage.error }, { status: usage.status });
    }
  }
  const blocked = ownerTest
    ? null
    : prefilter(submission, [
        "full_name",
        "venue",
        "additional_details",
        "services",
        "event_type",
      ]);
  const screening = ownerTest
    ? OWNER_TEST_SCREENING
    : blocked
      ? {
          decision: "reject" as const,
          category: blocked.category,
          confidence: 100,
          reason: blocked.reason,
          screened: true,
          ownerTest: false,
        }
      : {
          ...(await screenSubmission(submission, {
            mildProfanity: hasMildProfanity(submission, [
              "full_name",
              "venue",
              "additional_details",
            ]),
          })),
          ownerTest: false,
        };

  if (!ownerTest) {
    await noteScreeningForIp({
      site: "otp",
      ip,
      decision: screening.decision,
      category: screening.category,
      confidence: screening.confidence,
      source: blocked ? "prefilter" : "ai",
    });
  }

  // Always store, regardless of screening decision.
  try {
    await insertContactSubmission({
      ...submission,
      screening_decision: screening.decision,
      screening_category: screening.category,
      screening_confidence: screening.confidence,
      screening_reason: screening.reason,
      owner_test: screening.ownerTest,
    });
  } catch (err) {
    console.error("[contact] database save failed:", err);
    return NextResponse.json(
      { error: "Unable to save your request. Please try again or email us directly." },
      { status: 500 },
    );
  }

  // Rejected: skip Resend, but return a normal success so spammers get no signal.
  if (screening.decision === "reject") {
    console.warn(
      `[contact] filtered [${screening.category}] from ${ip}: ${screening.reason}`,
    );
    return NextResponse.json({ success: true });
  }

  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (!resendKey) {
    console.error("[contact] RESEND_API_KEY is not configured.");
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(resendKey);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "contact@onetalentproductions.com",
      to: process.env.RESEND_TO_EMAIL ?? "onetalentproductions@gmail.com",
      replyTo: submission.email,
      subject: `New Event Inquiry${submission.full_name.trim() ? ` from ${submission.full_name.trim()}` : ""}`,
      html: buildEmailHtml(submission),
    });
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Unable to send your request. Please try again or email us directly." },
        { status: 503 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json(
      { error: "Unable to send your request. Please try again or email us directly." },
      { status: 503 },
    );
  }
}
