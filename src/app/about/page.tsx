import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { team, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story, mission, and people behind One Talent Productions.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title={
          <>
            One{" "}
            <span className="text-gradient-gold">talent</span>, put to work for
            your event.
          </>
        }
        description={`${site.name} takes its name from the parable of the talents (Matthew 25:14–30). A servant is given one talent and buries it in the ground rather than putting it to use — and that's the mistake we built this company to avoid. At OTP, we aim to provide high-quality technical services that go above and beyond the norm, saving you money and time and proving you can entrust us with your needs no matter the scale.`}
      />

      {/* Founder */}
      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <SectionHeading
          eyebrow="Who runs the show"
          title="Lean, hands-on, and accountable."
          description="One Talent Productions is a focused technical operation — when you book us, you get the person who actually runs your event, not a hand-off."
        />
        <div className="mt-12 grid gap-8 rounded-3xl border border-border surface-card p-6 shadow-soft sm:grid-cols-[auto_1fr] sm:items-center sm:p-8">
          {team.map((member) => (
            <div key={member.name} className="contents">
              <div className="relative flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-gold-soft/40 via-gold/30 to-orange/30">
                <div className="grain" aria-hidden />
                <span className="font-display text-5xl font-extrabold text-gold-ink/70">
                  {member.initials}
                </span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold">{member.name}</h3>
                <p className="mt-1 text-sm font-semibold text-gold-strong">
                  {member.role}
                </p>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  A technical-first producer who lives in the gear — streaming
                  encoders, mixing consoles, lighting rigs, and the wiring that
                  ties a venue together. Calm under pressure, prepared for the
                  what-ifs, and focused on one thing: your event going right.
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
