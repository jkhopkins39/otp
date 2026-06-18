import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectCard } from "@/components/work/project-card";
import { listJobs } from "@/lib/site-store";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Recent AV, sound, lighting, live streaming, and event production projects from One Talent Productions in West Georgia.",
};

const ACCENTS = [
  "from-amber-400 via-orange-500 to-rose-500",
  "from-yellow-300 via-amber-500 to-orange-600",
  "from-sky-400 via-blue-500 to-indigo-600",
  "from-emerald-400 via-teal-500 to-cyan-600",
  "from-purple-400 via-violet-500 to-indigo-500",
  "from-rose-400 via-pink-500 to-fuchsia-600",
];

export default async function WorkPage() {
  const jobs = await listJobs();

  const featured = jobs.filter((j) => j.featured);
  const rest = jobs.filter((j) => !j.featured);

  return (
    <>
      <PageHeader
        eyebrow="Our work"
        title={
          <>
            Recent{" "}
            <span className="text-gradient-gold">projects</span>.
          </>
        }
        description="AV production, live streaming, sound, lighting, and event tech — here's what we've been working on."
      />

      {featured.length > 0 && (
        <Section className="pt-6 sm:pt-8 lg:pt-10">
          <SectionHeading
            compact
            eyebrow="Featured"
            title="Recent highlights."
          />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((job, i) => (
              <li key={job.id}>
                <ProjectCard
                  project={{
                    title: job.title,
                    category: job.category,
                    year: job.year,
                    blurb: job.blurb,
                    accent: ACCENTS[i % ACCENTS.length],
                    featured: true,
                    image_url: job.image_url || undefined,
                  }}
                />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {rest.length > 0 && (
        <Section className="py-12 sm:py-14 lg:py-16">
          {featured.length > 0 && (
            <SectionHeading
              compact
              eyebrow="More work"
              title="All projects."
            />
          )}
          <ul className={`${featured.length > 0 ? "mt-8" : ""} grid gap-5 sm:grid-cols-2 lg:grid-cols-3`}>
            {rest.map((job, i) => (
              <li key={job.id}>
                <ProjectCard
                  project={{
                    title: job.title,
                    category: job.category,
                    year: job.year,
                    blurb: job.blurb,
                    accent: ACCENTS[(featured.length + i) % ACCENTS.length],
                    image_url: job.image_url || undefined,
                  }}
                />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {jobs.length === 0 && (
        <Section className="pt-6 sm:pt-8 lg:pt-10">
          <p className="text-center text-muted-foreground">Projects coming soon.</p>
        </Section>
      )}
    </>
  );
}
