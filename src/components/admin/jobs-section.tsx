"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Briefcase, Star } from "lucide-react";
import { createJobAction, deleteJobAction } from "@/app/admin/actions";
import type { DbJob } from "@/lib/site-store";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground " +
  "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/60";

export function JobsSection({ jobs }: { jobs: DbJob[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [blurb, setBlurb] = useState("");
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await createJobAction({ title, category, year, blurb, featured });
      if (!res.ok) { setError(res.error); return; }
      setTitle(""); setCategory(""); setYear(String(new Date().getFullYear()));
      setBlurb(""); setFeatured(false);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteJobAction(id);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start">
      {/* Form */}
      <form onSubmit={handleAdd} className="flex flex-col gap-4 rounded-2xl border border-border surface-card p-6 shadow-soft lg:sticky lg:top-24">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-gold-ink shadow-gold">
            <Plus className="h-4 w-4" />
          </span>
          <h2 className="font-display text-lg font-bold">Add recent job</h2>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Title <span className="text-gold-strong">*</span></label>
          <input className={inputBase} value={title} onChange={e => setTitle(e.target.value)} placeholder="Corporate Summit Live Stream" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Category</label>
            <input className={inputBase} value={category} onChange={e => setCategory(e.target.value)} placeholder="Live Stream" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Year</label>
            <input className={inputBase} value={year} onChange={e => setYear(e.target.value)} placeholder="2025" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Description <span className="text-xs font-normal text-muted-foreground">(optional)</span></label>
          <textarea className={cn(inputBase, "resize-y")} value={blurb} onChange={e => setBlurb(e.target.value)} rows={2} placeholder="Short description…" />
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={featured}
            onChange={e => setFeatured(e.target.checked)}
            className="h-4 w-4 accent-gold"
          />
          <span className="text-sm font-medium">Show on home page (featured)</span>
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 text-sm font-medium text-gold-ink shadow-gold transition-all hover:-translate-y-0.5 hover:shadow-gold-lg disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {isPending ? "Adding…" : "Add job"}
        </button>
      </form>

      {/* List */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-gold" />
          <h2 className="font-display text-xl font-bold">Recent jobs</h2>
          <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{jobs.length}</span>
        </div>

        {jobs.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">No jobs yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {jobs.map((j) => (
              <li key={j.id} className="flex items-start gap-3 rounded-2xl border border-border surface-card p-4 shadow-soft">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{j.title}</p>
                    {j.featured && (
                      <span className="flex items-center gap-0.5 rounded-full bg-gold/12 px-2 py-0.5 text-xs font-medium text-gold-strong ring-1 ring-gold/20">
                        <Star className="h-2.5 w-2.5 fill-gold-strong" /> Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{j.category} · {j.year}</p>
                  {j.blurb && <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{j.blurb}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(j.id)}
                  disabled={isPending}
                  aria-label={`Delete ${j.title}`}
                  className="shrink-0 rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-red-400/50 hover:text-red-500 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
