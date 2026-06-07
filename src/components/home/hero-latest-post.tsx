"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronDown, Newspaper } from "lucide-react";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { YouTubeEmbed } from "@/components/blog/youtube-embed";
import { cn } from "@/lib/utils";

const MAX_CHARS = 520;
const MAX_PARAGRAPHS = 5;

function splitParagraphs(body: string) {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function isLongBody(body: string) {
  const paragraphs = splitParagraphs(body);
  return body.length > MAX_CHARS || paragraphs.length > MAX_PARAGRAPHS;
}

export function HeroLatestPost({ post }: { post: Post }) {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = splitParagraphs(post.body);
  const long = isLongBody(post.body);
  const visible =
    expanded || !long ? paragraphs : paragraphs.slice(0, MAX_PARAGRAPHS);

  return (
    <article className="relative flex max-h-[min(62vh,560px)] flex-col overflow-hidden rounded-2xl border border-gold/30 surface-card shadow-gold-lg ring-1 ring-gold/10">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-brand-gradient opacity-80" aria-hidden />

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5 sm:p-6">
        <div className="flex flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/35 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold-strong">
            <Newspaper className="h-3 w-3" aria-hidden />
            Latest from the blog
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 text-gold" aria-hidden />
            {formatDate(post.createdAt)}
          </span>
          <h2 className="font-display text-xl font-bold leading-tight tracking-tight sm:text-2xl">
            {post.title}
          </h2>
        </div>

        {post.videoId ? (
          <YouTubeEmbed videoId={post.videoId} title={post.title} />
        ) : null}

        {paragraphs.length > 0 ? (
          <div className="flex flex-col gap-3">
            {visible.map((para, i) => (
              <p
                key={i}
                className="text-sm leading-relaxed text-muted-foreground"
              >
                {para}
              </p>
            ))}

            {long ? (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-gold-strong transition-colors hover:text-gold"
              >
                {expanded ? "Show less" : "Read more"}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expanded && "rotate-180",
                  )}
                />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="shrink-0 border-t border-border px-5 py-3 sm:px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-strong transition-colors hover:text-gold"
        >
          All posts
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export function HeroLatestPostEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border surface-card px-6 py-12 text-center shadow-soft">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
        <Newspaper className="h-6 w-6" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="font-display text-lg font-bold">No posts yet</p>
        <p className="text-sm text-muted-foreground">
          Field notes and updates will show up here.
        </p>
      </div>
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-strong transition-colors hover:text-gold"
      >
        Visit the blog
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
