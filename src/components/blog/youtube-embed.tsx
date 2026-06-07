"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";
import { youTubeEmbedUrl, youTubeThumbnail } from "@/lib/youtube";
import { cn } from "@/lib/utils";

/**
 * Premium YouTube "facade": renders a styled thumbnail + play button first,
 * and only injects the heavy iframe after the user clicks. This keeps the
 * feed fast (no third-party scripts until requested) and looks intentional.
 */
export function YouTubeEmbed({
  videoId,
  title = "Embedded video",
  className,
}: {
  videoId: string;
  title?: string;
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div
      className={cn(
        "group relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black shadow-lift ring-1 ring-gold/10",
        className,
      )}
    >
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={youTubeEmbedUrl(videoId)}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Play video: ${title}`}
          className="absolute inset-0 h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        >
          <Image
            src={youTubeThumbnail(videoId)}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Cinematic overlay */}
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

          {/* Play button */}
          <motion.span
            initial={false}
            whileHover={reduce ? undefined : { scale: 1.08 }}
            whileTap={reduce ? undefined : { scale: 0.94 }}
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-gradient text-gold-ink shadow-gold-lg ring-1 ring-white/30"
          >
            <Play className="ml-0.5 h-7 w-7 fill-current" />
          </motion.span>

          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            YouTube
          </span>
        </button>
      )}
    </div>
  );
}
