import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { ContactForm } from "@/components/contact/contact-form";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your event and we'll get back to you within 1–2 business days.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title={
          <>
            Let&apos;s make your{" "}
            <span className="text-gradient-gold">event happen</span>.
          </>
        }
        description="Fill out the form below with as much detail as you can. The more we know upfront, the faster we can get you a quote and start planning."
      />

      <Section className="pt-4 sm:pt-5 lg:pt-6 pb-12 sm:pb-16 lg:pb-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-start">

          {/* Sidebar — contact details */}
          <aside className="flex flex-col gap-5 rounded-3xl border border-border surface-card p-5 shadow-soft lg:sticky lg:top-24">
            <div>
              <h2 className="font-display text-base font-semibold">Contact us directly</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Prefer to call or email? Reach us any time.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <a
                href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}
                className="group flex items-center gap-3 text-sm transition-colors hover:text-foreground text-muted-foreground"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/12 ring-1 ring-gold/25 transition-colors group-hover:bg-gold/20">
                  <Phone className="h-4 w-4 text-gold-strong" />
                </span>
                {site.phone}
              </a>

              <a
                href={`mailto:${site.email}`}
                className="group flex items-center gap-3 text-sm transition-colors hover:text-foreground text-muted-foreground"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/12 ring-1 ring-gold/25 transition-colors group-hover:bg-gold/20">
                  <Mail className="h-4 w-4 text-gold-strong" />
                </span>
                {site.email}
              </a>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/12 ring-1 ring-gold/25">
                  <MapPin className="h-4 w-4 text-gold-strong" />
                </span>
                {site.location}
              </div>
            </div>

            <div className="h-px bg-border" />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-strong">
                Response time
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                We typically respond within 1–2 business days.
              </p>
            </div>
          </aside>

          {/* Form */}
          <div className="rounded-3xl border border-border surface-card p-5 shadow-soft sm:p-6">
            <ContactForm />
          </div>

        </div>
      </Section>
    </>
  );
}
