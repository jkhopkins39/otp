import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site, stats } from "@/lib/content";
import type { Post } from "@/lib/posts";
import {
  HeroLatestPost,
  HeroLatestPostEmpty,
} from "@/components/home/hero-latest-post";

export function Hero({ latestPost }: { latestPost: Post | null }) {
  return (
    <section className="relative overflow-hidden">
      <div className="container relative grid items-center gap-8 pb-10 pt-6 sm:pb-12 sm:pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-14 lg:pt-8">
        <div className="text-panel">
          <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-gold/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold-strong surface-readable shadow-soft">
            <Sparkles className="h-3.5 w-3.5" />
            Live streaming · sound · lighting · AV
          </span>

          <h1 className="mt-4 font-display text-[2.15rem] font-extrabold leading-[1.04] tracking-tight sm:text-5xl lg:text-[3.5rem]">
            Sound, lighting, and live{" "}
            <span className="text-gradient-gold">streaming</span>{" "}
            for events in{" "}
            <span className="relative inline-block">
              West Georgia
              <svg
                viewBox="0 0 300 14"
                className="absolute -bottom-2 left-0 h-3 w-full text-gold"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 11C60 4 120 3 180 6c40 2 80 4 116 1"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/80">
            {site.name} is a full-service AV and production company in West
            Georgia. We handle sound, lighting, live streaming, video, and AV
            installation for churches, corporate events, concerts, and sports.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button href="/portfolio" size="md">
              View our work
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/about" variant="secondary" size="md">
              <Play className="h-4 w-4 text-gold" />
              Our story
            </Button>
          </div>

          <dl className="mt-8 grid max-w-lg grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-xl font-bold text-foreground sm:text-2xl">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs leading-snug text-muted-foreground">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Latest blog post */}
        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          {latestPost ? (
            <HeroLatestPost post={latestPost} />
          ) : (
            <HeroLatestPostEmpty />
          )}
        </div>
      </div>
    </section>
  );
}
