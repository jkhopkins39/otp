import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/work/project-card";
import { ClientMarquee } from "@/components/work/client-marquee";
import { services } from "@/lib/content";
import { getFeaturedPost } from "@/lib/posts-store";
import { listVenues, listJobs } from "@/lib/site-store";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredPost, venues, jobs] = await Promise.all([
    getFeaturedPost(),
    listVenues(),
    listJobs(),
  ]);

  const featuredJobs = jobs.filter((j) => j.featured).slice(0, 3);

  return (
    <>
      <Hero latestPost={featuredPost} />

      {/* Clients strip */}
      <section className="surface-readable border-y border-border py-6 sm:py-7">
        <div className="container flex flex-col gap-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Trusted by churches, venues, and event teams across Georgia
          </p>
          <ClientMarquee venues={venues} />
        </div>
      </section>

      {/* Services */}
      <Section className="py-14 sm:py-16 lg:py-20">
        <SectionHeading
          compact
          title="Sound, lighting, AV, and live streaming."
          description="Sound, lighting, streaming, video, and AV installation from one production company. One team, one call, one point of contact."
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <li
                key={service.title}
                className="group rounded-2xl border border-border surface-card p-5 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-gold hover:shadow-lift motion-reduce:hover:translate-y-0"
              >
                <h3 className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-foreground">
                  <Icon className="h-5 w-5 shrink-0 text-gold-strong" aria-hidden />
                  {service.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Featured work */}
      {featuredJobs.length > 0 && (
        <Section className="surface-readable border-y border-border py-14 sm:py-16 lg:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading compact title="Recent work." />
            <Button href="/work" variant="outline" size="md" className="shrink-0">
              See all work
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <li key={job.id}>
                <ProjectCard
                  project={{
                    title: job.title,
                    category: job.category,
                    year: job.year,
                    blurb: job.blurb,
                    accent: "bg-muted",
                    featured: job.featured,
                    image_url: job.image_url || undefined,
                  }}
                />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* CTA */}
      <Section className="py-14 sm:py-16 lg:py-20">
        <div className="rounded-2xl bg-foreground px-6 py-12 text-center dark:bg-muted dark:ring-1 dark:ring-border sm:px-12 sm:py-14">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
            <span className="accent-rule" aria-hidden />
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-background dark:text-foreground sm:text-3xl lg:text-4xl">
              Have an event coming up?
            </h2>
            <p className="text-sm leading-relaxed text-background/75 dark:text-muted-foreground sm:text-base">
              Tell us about your event and we will handle the AV, sound, and
              lighting from load-in to teardown.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Button href="/contact" size="md">
                Start a project
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                href="/portfolio"
                variant="outline"
                size="md"
                className="border-background/35 text-background hover:border-gold hover:text-gold dark:border-border dark:text-foreground dark:hover:text-gold"
              >
                See client reviews
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
