import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { site, values, stats } from "@/lib/content";
import { listTeamMembers } from "@/lib/site-store";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About",
  description:
    "The story, mission, and people behind One Talent Productions.",
};

export default async function AboutPage() {
  const team = await listTeamMembers();

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

      {/* Team */}
      <Section className="pt-6 sm:pt-8 lg:pt-10">
        <SectionHeading
          eyebrow="The team"
          title="Hands-on and accountable."
          description="When you book One Talent Productions, you get the person who actually runs your event."
        />
        <div className="mt-12 flex flex-col gap-8">
          {team.map((member) => (
            <div
              key={member.id}
              className="grid gap-6 rounded-3xl border border-border surface-card p-6 shadow-soft sm:grid-cols-[auto_1fr] sm:items-center sm:p-8"
            >
              {/* Avatar / PFP */}
              <div className="relative flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-gold-soft/40 via-gold/30 to-orange/30">
                <div className="grain" aria-hidden />
                {member.pfp_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.pfp_url}
                    alt={member.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-display text-5xl font-extrabold text-gold-ink/70">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-display text-2xl font-bold">{member.name}</h3>
                <p className="mt-1 text-sm font-semibold text-gold-strong">{member.role}</p>
                {member.bio && (
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {member.bio}
                  </p>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground"
                  >
                    <Mail className="h-4 w-4" />
                    {member.email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Values */}
      <Section className="py-12 sm:py-14 lg:py-16">
        <SectionHeading
          eyebrow="Our values"
          title="Why we do this."
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <li key={v.title} className="flex flex-col gap-3 rounded-2xl border border-border surface-card p-6 shadow-soft">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/12 text-gold-strong ring-1 ring-gold/20">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-bold">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{v.description}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Stats */}
      <Section className="surface-readable border-y border-border py-12 sm:py-14 lg:py-16">
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <li key={s.label} className="flex flex-col items-center gap-1 text-center">
              <span className="font-display text-4xl font-extrabold text-gold-strong">{s.value}</span>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
