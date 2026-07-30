import { Star } from "lucide-react";
import type { Project } from "@/lib/content";

/**
 * `project.accent` is now a flat neutral surface class (see work/page.tsx) —
 * it only paints the image-less placeholder tile, which also gets an accent
 * corner rule so the card still carries the brand signal.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border surface-card shadow-soft transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-gold hover:shadow-lift motion-reduce:hover:translate-y-0">
      <div
        className={`relative aspect-[4/3] overflow-hidden border-b border-border ${
          project.image_url ? "bg-muted" : project.accent
        }`}
      >
        {project.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image_url}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <span
            className="absolute left-0 top-0 h-12 w-[3px] bg-gold"
            aria-hidden
          />
        )}

        <span
          className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-semibold ${
            project.image_url
              ? "bg-foreground/80 text-background backdrop-blur-sm"
              : "bg-card text-muted-foreground"
          }`}
        >
          {project.category}
        </span>
        <span
          className={`absolute right-3 top-3 rounded-md px-2.5 py-1 text-xs font-semibold tabular-nums ${
            project.image_url
              ? "bg-foreground/80 text-background backdrop-blur-sm"
              : "bg-card text-muted-foreground"
          }`}
        >
          {project.year}
        </span>

        {project.featured && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-md bg-gold-strong px-2.5 py-1 text-xs font-semibold text-gold-ink">
            <Star className="h-3 w-3 fill-current" aria-hidden />
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
          {project.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {project.blurb}
        </p>
      </div>
    </article>
  );
}
