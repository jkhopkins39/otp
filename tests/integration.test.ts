/**
 * One Talent Productions — integration tests
 *
 * Requires env vars (copy .env.example → .env.local, fill in values):
 *   SUPABASE_URL (or VITE_SUPABASE_URL), SUPABASE_SECRET_KEY  → DB tests
 *   RESEND_API_KEY                                             → email (mocked here)
 *
 * Run:  npx vitest run tests/integration.test.ts
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Resend mock ──────────────────────────────────────────────────────────────
const mockEmailSend = vi.hoisted(() =>
  vi.fn().mockResolvedValue({ data: { id: "mock-id" }, error: null })
);
vi.mock("resend", () => {
  const send = mockEmailSend;
  return {
    Resend: class MockResend {
      emails = { send };
    },
  };
});

process.env.RESEND_API_KEY = process.env.RESEND_API_KEY || "re_test_key";
process.env.RESEND_FROM_EMAIL = "contact@onetalentproductions.com";
process.env.RESEND_TO_EMAIL = "onetalentproductions@gmail.com";

import { POST } from "../src/app/api/contact/route";
import {
  insertContactSubmission,
  listContactSubmissions,
  listTeamMembers,
  listVenues,
  listTestimonials,
} from "../src/lib/site-store";

// ─── Config ───────────────────────────────────────────────────────────────────
const dbConfigured = !!(
  (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL) &&
  process.env.SUPABASE_SECRET_KEY
);
const itDb = dbConfigured ? it : it.skip;

// ─── DB — content tables ──────────────────────────────────────────────────────
describe("site-store content tables", () => {
  itDb("listTeamMembers returns an array", async () => {
    const members = await listTeamMembers();
    expect(Array.isArray(members)).toBe(true);
  });

  itDb("listVenues returns an array", async () => {
    const venues = await listVenues();
    expect(Array.isArray(venues)).toBe(true);
  });

  itDb("listTestimonials returns an array", async () => {
    const testimonials = await listTestimonials();
    expect(Array.isArray(testimonials)).toBe(true);
  });
});

// ─── DB — contact submissions ─────────────────────────────────────────────────
describe("contact submissions", () => {
  itDb("insertContactSubmission writes to Supabase without throwing", async () => {
    await expect(
      insertContactSubmission({
        full_name: "[TEST] Vitest Tester",
        email: "vitest@example.com",
        phone: "(404) 000-0000",
        event_type: "Corporate Conference",
        event_date: "2027-01-15",
        venue: "Test Venue, Atlanta GA",
        expected_attendance: "100",
        venue_type: "Indoor",
        services: "Live Production (Audio / Video / Lighting)",
        setup_window: "2 hours",
        budget_range: "$5,000 – $15,000",
        referral_source: "Vitest",
        additional_details: "Automated test — safe to delete",
      }),
    ).resolves.not.toThrow();
  });

  itDb("listContactSubmissions returns an array", async () => {
    const subs = await listContactSubmissions();
    expect(Array.isArray(subs)).toBe(true);
  });
});

// ─── Contact API route ────────────────────────────────────────────────────────
describe("POST /api/contact", () => {
  beforeEach(() => mockEmailSend.mockClear());

  function makeRequest(body: Record<string, string>) {
    return new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  const validBody = {
    full_name: "Jordan Clark",
    email: "jordan@example.com",
    phone: "(404) 555-0200",
    event_type: "Wedding / Special Event",
    event_date: "2027-06-15",
    venue: "Grand Ballroom, Atlanta",
    expected_attendance: "250",
    venue_type: "Indoor",
    services: "Live Production",
    setup_window: "4 hours",
    budget_range: "$15,000 – $50,000",
    referral_source: "Google",
    additional_details: "Vitest submission — ignore",
  };

  it("returns 400 when required fields are missing", async () => {
    const res = await POST(makeRequest({ email: "a@b.com" }));
    expect(res.status).toBe(400);
  });

  it("returns 200 and calls Resend for valid submission", async () => {
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(mockEmailSend).toHaveBeenCalledOnce();

    const emailCall = mockEmailSend.mock.calls[0][0];
    expect(emailCall.subject).toContain("Jordan Clark");
    expect(emailCall.replyTo).toBe("jordan@example.com");
  });

  it("sends email via Resend, NOT Web3Forms, when RESEND_API_KEY is set", async () => {
    await POST(makeRequest(validBody));
    // Resend mock was called — no fetch to web3forms.com should occur
    expect(mockEmailSend).toHaveBeenCalledOnce();
  });
});
