import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/work/project-card";
import { ClientMarquee } from "@/components/work/client-marquee";
import { services, projects } from "@/lib/content";
import { listPosts } from "@/lib/posts-store";

/** Refresh the featured latest post periodically. */
export const revalidate = 60;

export default async function HomePage() {
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const posts = await listPosts();
  const latestPost = posts[0] ?? null;

  return (
    <>
      <Hero latestPost={latestPost} />

      {/* Clients strip */}
      <section className="surface-readable border-y border-border py-6 sm:py-7">
        <div className="container flex flex-col gap-4">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Trusted by churches, venues, and teams that can&apos;t go dark
          </p>
          <ClientMarquee />
        </div>
      </section>

      {/* Services */}
      <Section className="py-12 sm:py-14 lg:py-16">
        <SectionHeading
          compact
          eyebrow="What we do"
          title={
            <>
              One crew for sound, light,{" "}
              <span className="text-gradient-gold">stream</span>, and screen.
            </>
          }
          description="Streaming, audio, lighting, video, and AV installation under one roof — fewer vendors to chase and one team accountable for your event."
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
      <Section className="surface-readable border-y border-border py-12 sm:py-14 lg:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            compact
            eyebrow="Recent work"
            title={
              <>
                Events we&apos;ve{" "}
                <span className="text-gradient-gold">powered</span> recently.
              </>
            }
          />
          <Button href="/portfolio" variant="outline" size="md" className="shrink-0">
            See all work
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <li key={project.title}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </Section>

      {/* CTA */}
      <Section className="py-12 sm:py-14 lg:py-16">
        <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-brand-gradient px-6 py-10 text-center text-gold-ink shadow-gold-lg sm:px-12 sm:py-12">
          <div className="grain" aria-hidden />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-4">
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              Have an event coming up?
            </h2>
            <p className="text-sm font-medium leading-relaxed text-gold-ink/80 sm:text-base">
              Tell us the date, the venue, and what it needs to do. We&apos;ll
              bring the gear, the crew, and a setup that just works.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                href="/blog"
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
                See our work
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
