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
            AV and event production in{" "}
            <span className="text-gradient-gold">West Georgia</span>.
          </>
        }
        description={`${site.name} takes its name from the parable of the talents (Matthew 25). We built this company on the idea that skills and equipment should be put to work. We provide professional AV production, sound, and lighting services across West Georgia and the surrounding area.`}
      />

      {/* Founder */}
      <Section className="pt-6 sm:pt-8 lg:pt-10">
        <SectionHeading
          eyebrow="The team"
          title="Hands-on and accountable."
          description="When you book One Talent Productions, you get the person who actually runs your event."
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
                  Technical producer with hands-on experience in live streaming,
                  sound, lighting, and AV installation. Based in West Georgia,
                  focused on getting your event right from setup to teardown.
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
