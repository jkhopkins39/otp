import { Inbox, Mail, Phone, Calendar, MapPin, DollarSign } from "lucide-react";
import type { DbContactSubmission } from "@/lib/site-store";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm">{value}</dd>
    </div>
  );
}

export function ContactsSection({ submissions }: { submissions: DbContactSubmission[] }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Inbox className="h-5 w-5 text-gold" />
        <h2 className="font-display text-xl font-bold">Contact submissions</h2>
        <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{submissions.length}</span>
      </div>

      {submissions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground/40" />
          <p className="font-display text-lg font-bold">No submissions yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Contact form leads will appear here once people fill out the form on the website.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-5">
          {submissions.map((s) => (
            <li key={s.id} className="rounded-2xl border border-border surface-card p-5 shadow-soft">
              {/* Header */}
              <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display text-lg font-bold">{s.full_name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(s.created_at)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`mailto:${s.email}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {s.email}
                  </a>
                  {s.phone && (
                    <a
                      href={`tel:${s.phone.replace(/[^\d+]/g, "")}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {s.phone}
                    </a>
                  )}
                </div>
              </div>

              <div className="h-px bg-border mb-4" />

              {/* Details grid */}
              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Event type" value={s.event_type} />
                <Field label="Event date" value={s.event_date} />
                <Field label="Venue" value={s.venue} />
                <Field label="Expected attendance" value={s.expected_attendance} />
                <Field label="Indoor / Outdoor" value={s.venue_type} />
                <Field label="Services needed" value={s.services} />
                <Field label="Setup window" value={s.setup_window} />
                <Field label="Budget range" value={s.budget_range} />
                <Field label="Referral source" value={s.referral_source} />
              </dl>

              {s.additional_details && (
                <div className="mt-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Additional details</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.additional_details}</dd>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
