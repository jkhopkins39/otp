import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${site.name}.`,
};

const h2 = "mt-10 font-display text-xl font-bold tracking-tight";
const p = "mt-3 text-base leading-relaxed text-muted-foreground";
const ul = "mt-3 list-disc space-y-1.5 pl-5 text-base leading-relaxed text-muted-foreground";
const link = "font-medium text-gold-strong underline-offset-4 hover:text-gold hover:underline";

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" description="Last updated: July 18, 2026" />

      <Section className="pt-8">
        <div className="mx-auto max-w-3xl">
          <p className={p}>
            {site.name} ("we," "us") operates this website. This policy explains what information we collect when
            you request a quote for your event, and how it&apos;s handled.
          </p>

          <h2 className={h2}>Information We Collect</h2>
          <p className={p}>When you submit our event inquiry form, we collect:</p>
          <ul className={ul}>
            <li>Your name, email address, and phone number</li>
            <li>Event type, date, venue, expected attendance, and venue type</li>
            <li>Services you're interested in, setup window, budget range, and referral source</li>
            <li>Any additional details you share with us</li>
          </ul>

          <h2 className={h2}>How We Use This Information</h2>
          <p className={p}>
            We use this information only to respond to your inquiry and put together a quote for your event. We do
            not use it for unsolicited marketing, and we do not sell or rent it to third parties.
          </p>

          <h2 className={h2}>How We Store It</h2>
          <p className={p}>
            Inquiries are stored in a secure database and a copy is emailed to us via Resend, our email-delivery
            provider, so we can track and respond to them. Both providers process this data on our behalf and are
            restricted from using it for their own purposes.
          </p>

          <h2 className={h2}>Cookies &amp; Analytics</h2>
          <p className={p}>This site does not use analytics or advertising tracking cookies.</p>

          <h2 className={h2}>Data Retention</h2>
          <p className={p}>
            We keep inquiries as long as reasonably needed for business and event-planning records. You can request
            deletion at any time using the contact info below.
          </p>

          <h2 className={h2}>Your Rights</h2>
          <p className={p}>
            You can request access to, correction of, or deletion of information you&apos;ve submitted by emailing{" "}
            <a href={`mailto:${site.email}`} className={link}>
              {site.email}
            </a>{" "}
            or calling{" "}
            <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className={link}>
              {site.phone}
            </a>
            .
          </p>

          <h2 className={h2}>Children&apos;s Privacy</h2>
          <p className={p}>
            This site is not directed at children under 13, and we do not knowingly collect information from anyone
            under 13.
          </p>

          <h2 className={h2}>Changes to This Policy</h2>
          <p className={p}>If this policy changes, the &quot;Last updated&quot; date above will be revised.</p>

          <h2 className={h2}>Contact</h2>
          <p className={p}>
            Questions about this policy? Reach us at{" "}
            <a href={`mailto:${site.email}`} className={link}>
              {site.email}
            </a>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
