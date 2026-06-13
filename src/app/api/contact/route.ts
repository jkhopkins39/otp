import { NextResponse } from "next/server";
import { insertContactSubmission } from "@/lib/site-store";

export async function POST(req: Request) {
  let body: Record<string, string>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const required = ["full_name", "email"];
  for (const field of required) {
    if (!body[field]?.trim()) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  // Save to Supabase (fire-and-forget; silently skipped if not configured)
  await insertContactSubmission({
    full_name: body.full_name ?? "",
    email: body.email ?? "",
    phone: body.phone ?? "",
    event_type: body.event_type ?? "",
    event_date: body.event_date ?? "",
    venue: body.venue ?? "",
    expected_attendance: body.expected_attendance ?? "",
    venue_type: body.venue_type ?? "",
    services: body.services ?? "",
    setup_window: body.setup_window ?? "",
    budget_range: body.budget_range ?? "",
    referral_source: body.referral_source ?? "",
    additional_details: body.additional_details ?? "",
  });

  // Forward to Web3Forms
  const key = process.env.WEB3FORMS_KEY ?? process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";
  if (!key) {
    // No Web3Forms key — still return success (submission is saved in Supabase)
    return NextResponse.json({ success: true });
  }

  const formData = new FormData();
  formData.append("access_key", key);
  formData.append("subject", "New Event Inquiry — One Talent Productions");
  formData.append("from_name", "One Talent Productions Website");
  formData.append("name", body.full_name ?? "");
  formData.append("email", body.email ?? "");

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
    if (value) formData.append(label, value);
  }

  try {
    const w3res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });
    const w3json = await w3res.json();
    if (!w3json.success) {
      // Submission saved in Supabase even if Web3Forms errors
      console.error("Web3Forms error:", w3json);
    }
  } catch (err) {
    console.error("Web3Forms fetch failed:", err);
  }

  return NextResponse.json({ success: true });
}
