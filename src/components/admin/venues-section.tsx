"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, MapPin, Pencil, Check, X } from "lucide-react";
import { createVenueAction, deleteVenueAction, updateVenueAction } from "@/app/admin/actions";
import type { DbVenue } from "@/lib/site-store";

const inputBase =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground " +
  "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/60";

export function VenuesSection({ venues }: { venues: DbVenue[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await createVenueAction(name);
      if (!res.ok) { setError(res.error); return; }
      setName("");
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteVenueAction(id);
      router.refresh();
    });
  }

  function startEdit(v: DbVenue) {
    setEditId(v.id);
    setEditName(v.name);
    setEditError("");
  }

  function handleSaveEdit() {
    if (!editId) return;
    setEditError("");
    startTransition(async () => {
      const res = await updateVenueAction(editId, editName);
      if (!res.ok) { setEditError(res.error); return; }
      setEditId(null);
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
          <h2 className="font-display text-lg font-bold">Add venue</h2>
        </div>
        <p className="text-sm text-muted-foreground">These names scroll across the home page marquee strip.</p>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Venue / Client name <span className="text-gold-strong">*</span></label>
          <input className={inputBase} value={name} onChange={e => setName(e.target.value)} placeholder="Grace Community Church" required />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 text-sm font-medium text-gold-ink shadow-gold transition-all hover:-translate-y-0.5 hover:shadow-gold-lg disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {isPending ? "Adding…" : "Add venue"}
        </button>
      </form>

      {/* List */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gold" />
          <h2 className="font-display text-xl font-bold">Venues &amp; clients</h2>
          <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{venues.length}</span>
        </div>

        {venues.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">No venues yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {venues.map((v) => (
              <li key={v.id} className="flex items-center gap-3 rounded-xl border border-border surface-card px-4 py-3 shadow-soft">
                {editId === v.id ? (
                  <>
                    <input
                      className={inputBase + " flex-1"}
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleSaveEdit(); } if (e.key === "Escape") setEditId(null); }}
                      autoFocus
                    />
                    {editError && <p className="text-xs text-red-500">{editError}</p>}
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={isPending}
                      aria-label="Save"
                      className="shrink-0 rounded-full border border-border p-1.5 text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      aria-label="Cancel"
                      className="shrink-0 rounded-full border border-border p-1.5 text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-medium">{v.name}</span>
                    <button
                      type="button"
                      onClick={() => startEdit(v)}
                      disabled={isPending}
                      aria-label={`Edit ${v.name}`}
                      className="shrink-0 rounded-full border border-border p-1.5 text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground disabled:opacity-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(v.id)}
                      disabled={isPending}
                      aria-label={`Delete ${v.name}`}
                      className="shrink-0 rounded-full border border-border p-1.5 text-muted-foreground transition-colors hover:border-red-400/50 hover:text-red-500 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
