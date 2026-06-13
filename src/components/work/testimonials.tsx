"use client";

import { Quote, Star } from "lucide-react";
import type { DbTestimonial } from "@/lib/site-store";

export function Testimonials({ testimonials }: { testimonials: DbTestimonial[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {testimonials.map((t) => (
        <li
          key={t.id}
          className="relative flex flex-col gap-5 rounded-2xl border border-border surface-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lift"
        >
          <div className="flex items-center justify-between">
            <Quote className="h-8 w-8 text-gold/60" />
            <div className="flex gap-0.5" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold text-gold" aria-hidden />
              ))}
            </div>
          </div>
          <blockquote className="text-base leading-relaxed text-foreground">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-auto flex items-center gap-3 border-t border-border pt-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient font-display text-sm font-bold text-gold-ink">
              {t.author_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            <span className="flex flex-col">
              <span className="font-semibold">{t.author_name}</span>
              <span className="text-sm text-muted-foreground">{t.author_role}</span>
            </span>
          </figcaption>
        </li>
      ))}
    </ul>
  );
}
