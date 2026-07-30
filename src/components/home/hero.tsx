import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/content";
import type { Post } from "@/lib/posts";
import {
  HeroLatestPost,
  HeroLatestPostEmpty,
} from "@/components/home/hero-latest-post";

/**
 * Left: headline, lede, two actions — set directly on the page background.
 * Right: the live latest-post card, the one piece of real content up top.
 * The stats live on /about so they only get one moment on the site.
 */
export function Hero({ latestPost }: { latestPost: Post | null }) {
  return (
    <section className="relative">
      <div className="container relative grid items-center gap-10 pb-12 pt-12 sm:pb-14 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pb-16 lg:pt-20">
        <div>
          <span className="accent-rule" aria-hidden />

          <h1 className="mt-5 font-display text-[2.15rem] font-extrabold leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
            Sound, lighting, and live streaming for events in{" "}
            <span className="border-b-[3px] border-gold pb-0.5">
              West Georgia
            </span>
            .
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            {site.name} is a full-service AV and production company in West
            Georgia. We handle sound, lighting, live streaming, video, and AV
            installation for churches, corporate events, concerts, and sports.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/portfolio" size="md">
              View our work
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/about" variant="secondary" size="md">
              <Play className="h-4 w-4" />
              Our story
            </Button>
          </div>
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
