import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border surface-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-within:shadow-lift">
      {/* Placeholder art — swap the gradient block for <Image> when ready. */}
      <div
        className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${project.accent}`}
      >
        <div className="grain" aria-hidden />
        <span className="absolute left-4 top-4 rounded-full bg-black/25 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
          {project.category}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-black/25 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {project.year}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute bottom-4 right-4 inline-flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-background text-foreground opacity-0 shadow-lift transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>

      <div className="flex flex-col gap-2 p-5">
        <h3 className="font-display text-xl font-bold tracking-tight">
          <a href="#" className="after:absolute after:inset-0">
            <span className="sr-only">View </span>
            {project.title}
          </a>
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {project.blurb}
        </p>
      </div>
    </article>
  );
}
