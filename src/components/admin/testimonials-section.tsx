"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Quote } from "lucide-react";
import { createTestimonialAction, deleteTestimonialAction } from "@/app/admin/actions";
import type { DbTestimonial } from "@/lib/site-store";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground " +
  "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/60";

export function TestimonialsSection({ testimonials }: { testimonials: DbTestimonial[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [quote, setQuote] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [error, setError] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await createTestimonialAction({ quote, author_name: authorName, author_role: authorRole });
      if (!res.ok) { setError(res.error); return; }
      setQuote(""); setAuthorName(""); setAuthorRole("");
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteTestimonialAction(id);
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
          <h2 className="font-display text-lg font-bold">Add testimonial</h2>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Quote <span className="text-gold-strong">*</span></label>
          <textarea className={cn(inputBase, "resize-y")} value={quote} onChange={e => setQuote(e.target.value)} rows={4} placeholder="They ran our entire event without a single hiccup…" required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Author name <span className="text-gold-strong">*</span></label>
          <input className={inputBase} value={authorName} onChange={e => setAuthorName(e.target.value)} placeholder="Events Lead" required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Author role / organization</label>
          <input className={inputBase} value={authorRole} onChange={e => setAuthorRole(e.target.value)} placeholder="Summit Conferences" />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 text-sm font-medium text-gold-ink shadow-gold transition-all hover:-translate-y-0.5 hover:shadow-gold-lg disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {isPending ? "Adding…" : "Add testimonial"}
        </button>
      </form>

      {/* List */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Quote className="h-5 w-5 text-gold" />
          <h2 className="font-display text-xl font-bold">Testimonials</h2>
          <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{testimonials.length}</span>
        </div>

        {testimonials.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">No testimonials yet.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {testimonials.map((t) => (
              <li key={t.id} className="flex items-start gap-3 rounded-2xl border border-border surface-card p-4 shadow-soft">
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-2 text-xs font-semibold text-gold-strong">{t.author_name}</p>
                  {t.author_role && <p className="text-xs text-muted-foreground">{t.author_role}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id)}
                  disabled={isPending}
                  aria-label="Delete testimonial"
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
