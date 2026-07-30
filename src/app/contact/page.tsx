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
        title="Let's make your event happen."
        description="Fill out the form below with as much detail as you can. The more we know upfront, the faster we can get you a quote and start planning."
      />

      <Section className="pt-10 sm:pt-12 lg:pt-14 pb-12 sm:pb-16 lg:pb-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-start">

          {/* Sidebar — contact details */}
          <aside className="flex flex-col gap-5 rounded-2xl border border-border surface-card p-5 shadow-soft lg:sticky lg:top-24">
            <div>
              <h2 className="font-display text-base font-semibold text-foreground">
                Contact us directly
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Prefer to call or email? Reach us any time.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <a
                href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}
                className="group flex items-center gap-3 text-sm transition-colors hover:text-foreground text-muted-foreground"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted transition-colors group-hover:border-gold">
                  <Phone className="h-4 w-4 text-gold-strong" aria-hidden />
                </span>
                {site.phone}
              </a>

              <a
                href={`mailto:${site.email}`}
                className="group flex items-center gap-3 text-sm transition-colors hover:text-foreground text-muted-foreground"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted transition-colors group-hover:border-gold">
                  <Mail className="h-4 w-4 text-gold-strong" aria-hidden />
                </span>
                {site.email}
              </a>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
                  <MapPin className="h-4 w-4 text-gold-strong" aria-hidden />
                </span>
                {site.location}
              </div>
            </div>

            <div className="h-px bg-border" />

            <div>
              <p className="text-sm font-semibold text-foreground">Response time</p>
              <p className="mt-1 text-sm text-muted-foreground">
                We typically respond within 1–2 business days.
              </p>
            </div>
          </aside>

          {/* Form */}
          <div className="rounded-2xl border border-border surface-card p-5 shadow-soft sm:p-6">
            <ContactForm />
          </div>

        </div>
      </Section>
    </>
  );
}
