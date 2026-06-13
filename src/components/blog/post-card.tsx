"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Trash2, ChevronDown, Star } from "lucide-react";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { YouTubeEmbed } from "./youtube-embed";
import { riseItem } from "@/components/ui/motion";

export function PostCard({
  post,
  onDelete,
  onToggleFeatured,
}: {
  post: Post;
  onDelete?: (id: string) => void;
  onToggleFeatured?: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState(false);

  const paragraphs = post.body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const isLong = post.body.length > 280 || paragraphs.length > 2;
  const visible = expanded || !isLong ? paragraphs : paragraphs.slice(0, 1);

  return (
    <motion.article
      layout={!reduce}
      variants={reduce ? undefined : riseItem}
      className="group relative overflow-hidden rounded-2xl border border-border surface-card shadow-soft transition-shadow hover:shadow-lift"
    >
      {post.featured && (
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold-strong ring-1 ring-gold/30">
          <Star className="h-3 w-3 fill-gold-strong" />
          Featured
        </div>
      )}
      <div
        className="absolute inset-x-0 top-0 h-0.5 bg-brand-gradient opacity-60"
        aria-hidden
      />
      <div className="flex flex-col gap-5 p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 text-gold" />
              {formatDate(post.createdAt)}
            </span>
            <h3 className="font-display text-2xl font-bold leading-tight tracking-tight">
              {post.title}
            </h3>
          </div>

          {(onDelete || onToggleFeatured) && (
            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
              {onToggleFeatured && (
                <button
                  type="button"
                  onClick={() => onToggleFeatured(post.id)}
                  aria-label={post.featured ? "Remove featured" : `Feature this post on the homepage`}
                  title={post.featured ? "Remove featured" : "Set as homepage featured post"}
                  className={`rounded-full border p-2 transition-all ${
                    post.featured
                      ? "border-gold/50 text-gold-strong"
                      : "border-border text-muted-foreground hover:border-gold/50 hover:text-gold-strong"
                  }`}
                >
                  <Star className={`h-4 w-4 ${post.featured ? "fill-gold-strong" : ""}`} />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(post.id)}
                  aria-label={`Delete post: ${post.title}`}
                  className="rounded-full border border-border p-2 text-muted-foreground transition-all hover:border-red-400/50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {post.videoId ? (
          <YouTubeEmbed videoId={post.videoId} title={post.title} />
        ) : null}

        {paragraphs.length > 0 ? (
          <motion.div layout={!reduce} className="flex flex-col gap-3">
            {visible.map((para, i) => (
              <p
                key={i}
                className="text-[0.975rem] leading-relaxed text-muted-foreground"
              >
                {para}
              </p>
            ))}

            {isLong ? (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-gold-strong transition-colors hover:text-gold"
              >
                {expanded ? "Show less" : "Read more"}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            ) : null}
          </motion.div>
        ) : null}
      </div>
    </motion.article>
  );
}
