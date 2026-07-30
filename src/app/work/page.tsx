import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectCard } from "@/components/work/project-card";
import { listJobs } from "@/lib/site-store";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Recent AV, sound, lighting, live streaming, and event production projects from One Talent Productions in West Georgia.",
};

/**
 * Placeholder tint for projects with no image. Flat neutrals derived from the
 * palette (the old purple/emerald/rose gradients were off-brand); the accent
 * shows up as a corner rule inside ProjectCard instead.
 */
const ACCENTS = ["bg-muted", "bg-card", "bg-background"];

export default async function WorkPage() {
  const jobs = await listJobs();

  // Featured pinned at top, then the rest in display_order
  const sorted = [
    ...jobs.filter((j) => j.featured),
    ...jobs.filter((j) => !j.featured),
  ];

  return (
    <>
      <PageHeader
        title="Recent projects."
        description="AV production, live streaming, sound, lighting, and event tech — here's what we've been working on."
      />

      <Section className="pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-14">
        {sorted.length === 0 ? (
          <p className="text-center text-muted-foreground">Projects coming soon.</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((job, i) => (
              <li key={job.id}>
                <ProjectCard
                  project={{
                    title: job.title,
                    category: job.category,
                    year: job.year,
                    blurb: job.blurb,
                    accent: ACCENTS[i % ACCENTS.length],
                    featured: job.featured,
                    image_url: job.image_url || undefined,
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
