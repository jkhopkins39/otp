import { NextResponse } from "next/server";
import { Resend } from "resend";
import { insertContactSubmission } from "@/lib/site-store";
import {
  getClientIpFromHeaders,
  isRateLimited,
  isSpamSubmission,
} from "@/lib/spam-guard";

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
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

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

  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (!email || !phone) {
    return NextResponse.json({ error: "Email and phone are required" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const submission = {
    full_name: String(body.full_name ?? ""),
    email: String(body.email ?? ""),
    phone: String(body.phone ?? ""),
    event_type: String(body.event_type ?? ""),
    event_date: String(body.event_date ?? ""),
    venue: String(body.venue ?? ""),
    expected_attendance: String(body.expected_attendance ?? ""),
    venue_type: String(body.venue_type ?? ""),
    services: String(body.services ?? ""),
    setup_window: String(body.setup_window ?? ""),
    budget_range: String(body.budget_range ?? ""),
    referral_source: String(body.referral_source ?? ""),
    additional_details: String(body.additional_details ?? ""),
  };

  try {
    await insertContactSubmission(submission);
  } catch (err) {
    console.error("[contact] database save failed:", err);
    return NextResponse.json(
      { error: "Unable to save your request. Please try again or email us directly." },
      { status: 500 },
    );
  }

  // 2 — Send email via Resend (primary)
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "contact@onetalentproductions.com",
        to: process.env.RESEND_TO_EMAIL ?? "onetalentproductions@gmail.com",
        replyTo: email,
        subject: `New Event Inquiry${String(body.full_name ?? "").trim() ? ` from ${String(body.full_name).trim()}` : ""}`,
        html: buildEmailHtml(body as Record<string, string>),
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

  // 3 — Fall back to Web3Forms if Resend is not configured
  const web3Key = process.env.WEB3FORMS_KEY ?? process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";
  if (web3Key) {
    try {
      const fd = new FormData();
      fd.append("access_key", web3Key);
      fd.append("subject", `New Event Inquiry — ${body.full_name}`);
      fd.append("from_name", "One Talent Productions Website");
      fd.append("name", body.full_name ?? "");
      fd.append("email", body.email ?? "");

      const fields: [string, string][] = [
        ["Phone Number", body.phone],
        ["Event Type", body.event_type],
        ["Event Date", body.event_date],
        ["Venue", body.venue],
        ["Expected Attendance", body.expected_attendance],
        ["Venue Type", body.venue_type],
        ["Services Needed", body.services],
        ["Setup Window", body.setup_window],
        ["Budget Range", body.budget_range],
        ["Referral Source", body.referral_source],
        ["Additional Details", body.additional_details],
      ];
      for (const [label, value] of fields) {
        if (value) fd.append(label, value);
      }

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!json.success) {
        console.error("Web3Forms error:", json);
        return NextResponse.json(
          { error: "Unable to send your request. Please try again or email us directly." },
          { status: 503 },
        );
      }
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("Web3Forms fetch failed:", err);
      return NextResponse.json(
        { error: "Unable to send your request. Please try again or email us directly." },
        { status: 503 },
      );
    }
  }

  return NextResponse.json(
    { error: "Email service is not configured." },
    { status: 503 },
  );
}
