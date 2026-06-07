import { ArrowRight, Film, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site, stats } from "@/lib/content";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container relative grid items-center gap-8 pb-10 pt-6 sm:pb-12 sm:pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-14 lg:pt-8">
        <div className="text-panel">
          <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-gold/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold-strong surface-readable shadow-soft">
            <Sparkles className="h-3.5 w-3.5" />
            Live streaming · sound · lighting · AV
          </span>

          <h1 className="mt-4 font-display text-[2.15rem] font-extrabold leading-[1.04] tracking-tight sm:text-5xl lg:text-[3.5rem]">
            Sound, light, and{" "}
            <span className="text-gradient-gold">stream</span>, run by one
            technical{" "}
            <span className="relative inline-block">
              crew
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
            {site.name} handles the technical side of live events — streaming,
            audio, lighting, video, and AV installation. We bring the gear and
            the know-how so corporate events, concerts, services, and broadcasts
            run without a hitch.
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

        {/* Video preview */}
        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div className="relative aspect-[5/6] max-h-[min(58vh,520px)] overflow-hidden rounded-2xl border border-gold/30 bg-brand-gradient shadow-gold-lg ring-1 ring-white/10 lg:mx-auto lg:aspect-[4/5]">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Showreel preview of a corporate summit production"
            >
              <source src="/assets/hero.mp4" type="video/mp4" />
            </video>

            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15"
              aria-hidden
            />
            <div className="grain opacity-40" aria-hidden />

            {/* Preview chrome — not a live broadcast */}
            <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-black/45 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
                <Film className="h-3.5 w-3.5" aria-hidden />
                Showreel preview
              </span>

              <div className="space-y-3">
                <div className="flex items-end justify-between gap-3">
                  <div className="drop-shadow-sm">
                    <p className="font-display text-lg font-bold leading-tight text-white sm:text-xl">
                      Corporate Summit
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-white/75 sm:text-sm">
                      Multi-cam production
                    </p>
                  </div>
                  <span
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-sm"
                    aria-hidden
                  >
                    <Play className="h-4 w-4 fill-current pl-0.5" />
                  </span>
                </div>

                {/* Static progress bar — decorative preview scrubber, not live telemetry */}
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
                  <span className="block h-full w-[38%] rounded-full bg-white/70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
