import { Star } from "lucide-react";
import type { Project } from "@/lib/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border surface-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div
        className={`relative aspect-[4/3] overflow-hidden ${project.image_url ? "bg-muted" : `bg-gradient-to-br ${project.accent}`}`}
      >
        <div className="grain" aria-hidden />
        {project.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image_url}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-black/25 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
          {project.category}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-black/25 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {project.year}
        </span>
        {project.featured && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-gold/90 px-2.5 py-1 text-xs font-semibold text-gold-ink shadow-gold backdrop-blur">
            <Star className="h-3 w-3 fill-gold-ink" />
            Featured
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <div className="flex flex-col gap-2 p-5">
        <h3 className="font-display text-xl font-bold tracking-tight">{project.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{project.blurb}</p>
      </div>
    </article>
  );
}
