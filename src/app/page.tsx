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
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Trusted by churches, venues, and event teams across Georgia
          </p>
          <ClientMarquee venues={venues} />
        </div>
      </section>

      {/* Services */}
      <Section className="py-12 sm:py-14 lg:py-16">
        <SectionHeading
          compact
          eyebrow="What we do"
          title={
            <>
              Sound, lighting, AV, and live{" "}
              <span className="text-gradient-gold">streaming</span>.
            </>
          }
          description="Sound, lighting, streaming, video, and AV installation from one production company. One team, one call, one point of contact."
        />

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <li
                key={service.title}
                className="group relative overflow-hidden rounded-2xl border border-border surface-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lift"
              >
                <div
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-gradient transition-transform duration-300 group-hover:scale-x-100"
                  aria-hidden
                />
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/12 text-gold-strong ring-1 ring-gold/20 transition-colors group-hover:bg-gold/20">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold tracking-tight">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Featured work */}
      {featuredJobs.length > 0 && (
        <Section className="surface-readable border-y border-border py-12 sm:py-14 lg:py-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              compact
              eyebrow="Recent work"
              title={
                <>
                  Recent{" "}
                  <span className="text-gradient-gold">work</span>.
                </>
              }
            />
            <Button href="/portfolio" variant="outline" size="md" className="shrink-0">
              See all reviews
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <li key={job.id}>
                <ProjectCard
                  project={{
                    title: job.title,
                    category: job.category,
                    year: job.year,
                    blurb: job.blurb,
                    accent: "from-amber-400 via-orange-500 to-rose-500",
                    featured: job.featured,
                  }}
                />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* CTA */}
      <Section className="py-12 sm:py-14 lg:py-16">
        <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-brand-gradient px-6 py-10 text-center text-gold-ink shadow-gold-lg sm:px-12 sm:py-12">
          <div className="grain" aria-hidden />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-4">
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              Have an event coming up?
            </h2>
            <p className="text-sm font-medium leading-relaxed text-gold-ink/80 sm:text-base">
              Tell us about your event and we will handle the AV, sound, and
              lighting from load-in to teardown.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                href="/contact"
                variant="secondary"
                size="md"
                className="border-transparent bg-background text-foreground"
              >
                Start a project
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                href="/portfolio"
                size="md"
                className="bg-gold-ink text-background shadow-none hover:bg-gold-ink/90 dark:text-foreground"
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
