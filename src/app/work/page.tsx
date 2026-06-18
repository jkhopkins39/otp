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

  // Featured pinned at top, then the rest in display_order
  const sorted = [
    ...jobs.filter((j) => j.featured),
    ...jobs.filter((j) => !j.featured),
  ];

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

      <Section className="pt-6 pb-16 sm:pt-8 sm:pb-20 lg:pt-10">
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
