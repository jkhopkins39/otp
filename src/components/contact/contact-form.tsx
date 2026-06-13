"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EVENT_TYPES = [
  "Wedding",
  "Corporate Event / Conference",
  "Church Service",
  "Concert / Live Music",
  "Sports Event",
  "Private Party / Social",
  "Festival / Outdoor Event",
  "Other",
];

const ATTENDANCE_OPTIONS = [
  "Under 50",
  "50–200",
  "200–500",
  "500–1,000",
  "1,000+",
];

const SERVICES = [
  "Live Sound / PA System",
  "Stage & Event Lighting",
  "Live Streaming & Broadcast",
  "Video Recording",
  "LED Wall / Projection Screen",
  "AV Installation / Integration",
  "Other",
];

const SETUP_WINDOWS = [
  "Same day as event",
  "Night or day before",
  "Multiple days",
  "Not sure yet",
];

const BUDGET_RANGES = [
  "Under $1,000",
  "$1,000–$2,500",
  "$2,500–$5,000",
  "$5,000–$10,000",
  "$10,000+",
  "Not sure yet",
];

const REFERRAL_SOURCES = [
  "Word of mouth / Referral",
  "Google Search",
  "Social Media",
  "Past client",
  "Other",
];

type FormState = "idle" | "submitting" | "success" | "error";

const fieldBase =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground " +
  "placeholder:text-muted-foreground/60 transition-colors duration-150 " +
  "focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/60 " +
  "hover:border-gold/30";

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-foreground/90">
      {children}
      {required && <span className="ml-1 text-gold-strong" aria-hidden>*</span>}
    </label>
  );
}

function FieldGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-1.5", className)}>{children}</div>;
}

function SectionDivider({ step, title }: { step: string; title: string }) {
  return (
    <div className="flex items-center gap-4 pt-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/12 ring-1 ring-gold/30">
        <span className="font-display text-xs font-bold text-gold-strong">{step}</span>
      </div>
      <h3 className="font-display text-base font-semibold tracking-tight">{title}</h3>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [services, setServices] = useState<string[]>([]);

  function toggleService(service: string) {
    setServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service],
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");

    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload: Record<string, string> = {
      full_name: String(fd.get("full_name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      event_type: String(fd.get("event_type") ?? ""),
      event_date: String(fd.get("event_date") ?? ""),
      venue: String(fd.get("venue") ?? ""),
      expected_attendance: String(fd.get("expected_attendance") ?? ""),
      venue_type: String(fd.get("venue_type") ?? ""),
      services: services.length > 0 ? services.join(", ") : "",
      setup_window: String(fd.get("setup_window") ?? ""),
      budget_range: String(fd.get("budget_range") ?? ""),
      referral_source: String(fd.get("referral_source") ?? ""),
      additional_details: String(fd.get("additional_details") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setState("success");
        form.reset();
        setServices([]);
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center gap-5 rounded-3xl border border-border surface-card px-8 py-14 text-center shadow-soft">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/12 ring-1 ring-gold/30">
          <CheckCircle2 className="h-7 w-7 text-gold-strong" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-xl font-bold tracking-tight">We got your request!</h3>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            We&apos;ll review your event details and follow up within 1–2 business days.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="text-sm font-medium text-gold-strong underline-offset-4 transition-colors hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Honeypot */}
      <input type="text" name="_honey" className="hidden" aria-hidden="true" />

      {/* ── 1 · Contact Info ─────────────────────────────── */}
      <SectionDivider step="1" title="Contact Information" />

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldGroup className="sm:col-span-2">
          <Label required>Full Name</Label>
          <input
            type="text"
            name="full_name"
            placeholder="Jane Smith"
            required
            autoComplete="name"
            className={fieldBase}
          />
        </FieldGroup>

        <FieldGroup>
          <Label required>Email Address</Label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            className={fieldBase}
          />
        </FieldGroup>

        <FieldGroup>
          <Label required>Phone Number</Label>
          <input
            type="tel"
            name="phone"
            placeholder="(555) 555-5555"
            required
            autoComplete="tel"
            className={fieldBase}
          />
        </FieldGroup>
      </div>

      {/* ── 2 · Event Details ────────────────────────────── */}
      <SectionDivider step="2" title="Your Event" />

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldGroup>
          <Label required>Type of Event</Label>
          <select name="event_type" required className={cn(fieldBase, "cursor-pointer")}>
            <option value="">Select an event type…</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </FieldGroup>

        <FieldGroup>
          <Label>Event Date</Label>
          <input
            type="date"
            name="event_date"
            className={cn(fieldBase, "cursor-pointer")}
          />
        </FieldGroup>

        <FieldGroup className="sm:col-span-2">
          <Label>Venue Name &amp; Location</Label>
          <input
            type="text"
            name="venue"
            placeholder="The Grand Hall, Carrollton, GA"
            className={fieldBase}
          />
        </FieldGroup>

        <FieldGroup>
          <Label>Expected Attendance</Label>
          <select name="expected_attendance" className={cn(fieldBase, "cursor-pointer")}>
            <option value="">Select a range…</option>
            {ATTENDANCE_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </FieldGroup>

        <FieldGroup>
          <Label>Indoor or Outdoor?</Label>
          <select name="venue_type" className={cn(fieldBase, "cursor-pointer")}>
            <option value="">Select…</option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
            <option value="Both / Mixed">Both / Mixed</option>
            <option value="Not sure yet">Not sure yet</option>
          </select>
        </FieldGroup>
      </div>

      {/* ── 3 · Services ─────────────────────────────────── */}
      <SectionDivider step="3" title="Services Needed" />

      <fieldset>
        <legend className="sr-only">Select all services that apply</legend>
        <p className="mb-3 text-sm text-muted-foreground">Select all that apply.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SERVICES.map((service) => {
            const checked = services.includes(service);
            return (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service)}
                aria-pressed={checked}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-150",
                  checked
                    ? "border-gold/60 bg-gold/8 text-foreground ring-1 ring-gold/30"
                    : "border-border bg-card text-muted-foreground hover:border-gold/30 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                    checked ? "border-gold bg-gold" : "border-border bg-background",
                  )}
                  aria-hidden
                >
                  {checked && (
                    <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 fill-gold-ink" aria-hidden>
                      <path d="M1 4l2.5 2.5L9 1" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                {service}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* ── 4 · Logistics & Budget ───────────────────────── */}
      <SectionDivider step="4" title="Logistics &amp; Budget" />

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldGroup>
          <Label>Setup / Load-in Window</Label>
          <select name="setup_window" className={cn(fieldBase, "cursor-pointer")}>
            <option value="">Select…</option>
            {SETUP_WINDOWS.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </FieldGroup>

        <FieldGroup>
          <Label>Estimated Budget</Label>
          <select name="budget_range" className={cn(fieldBase, "cursor-pointer")}>
            <option value="">Select a range…</option>
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </FieldGroup>

        <FieldGroup className="sm:col-span-2">
          <Label>How did you hear about us?</Label>
          <select name="referral_source" className={cn(fieldBase, "cursor-pointer")}>
            <option value="">Select…</option>
            {REFERRAL_SOURCES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </FieldGroup>

        <FieldGroup className="sm:col-span-2">
          <Label>Anything else we should know?</Label>
          <textarea
            name="additional_details"
            rows={4}
            placeholder="Tell us about any special requirements, recurring events, existing equipment, accessibility needs, or anything else that would help us prepare."
            className={cn(fieldBase, "resize-y leading-relaxed")}
          />
        </FieldGroup>
      </div>

      {/* Submit */}
      {state === "error" && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Something went wrong. Please try again or email us at{" "}
          <a href="mailto:onetalentproductions@gmail.com" className="underline">
            onetalentproductions@gmail.com
          </a>
          .
        </div>
      )}

      <div className="flex items-center justify-between gap-4 pt-1">
        <p className="text-xs text-muted-foreground">
          <span className="text-gold-strong">*</span> Required fields
        </p>
        <Button
          type="submit"
          size="md"
          disabled={state === "submitting"}
          className="gap-2 self-end"
        >
          {state === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Send Request
              <Send className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
