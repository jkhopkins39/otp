"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Calendar, Pencil, Check, X } from "lucide-react";
import {
  createBookedEventAction,
  deleteBookedEventAction,
  updateBookedEventAction,
} from "@/app/admin/actions";
import type { DbBookedEvent } from "@/lib/site-store";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground " +
  "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/60";

const STATUS_OPTIONS = ["booked", "confirmed", "completed", "cancelled"];

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const statusColors: Record<string, string> = {
  booked: "bg-blue-500/12 text-blue-600 ring-blue-500/20",
  confirmed: "bg-green-500/12 text-green-600 ring-green-500/20",
  completed: "bg-gold/12 text-gold-strong ring-gold/20",
  cancelled: "bg-red-500/12 text-red-600 ring-red-500/20",
};

export function EventsSection({ events }: { events: DbBookedEvent[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Add form
  const [client, setClient] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [venue, setVenue] = useState("");
  const [services, setServices] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("booked");
  const [error, setError] = useState("");

  // Inline edit
  const [editId, setEditId] = useState<string | null>(null);
  const [editClient, setEditClient] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editVenue, setEditVenue] = useState("");
  const [editServices, setEditServices] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState("booked");
  const [editError, setEditError] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await createBookedEventAction({ client, event_date: eventDate, venue, services, notes, status });
      if (!res.ok) { setError(res.error); return; }
      setClient(""); setEventDate(""); setVenue(""); setServices(""); setNotes(""); setStatus("booked");
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteBookedEventAction(id);
      router.refresh();
    });
  }

  function startEdit(ev: DbBookedEvent) {
    setEditId(ev.id);
    setEditClient(ev.client);
    setEditDate(ev.event_date);
    setEditVenue(ev.venue);
    setEditServices(ev.services);
    setEditNotes(ev.notes);
    setEditStatus(ev.status);
    setEditError("");
  }

  function handleSaveEdit() {
    if (!editId) return;
    setEditError("");
    startTransition(async () => {
      const res = await updateBookedEventAction(editId, {
        client: editClient,
        event_date: editDate,
        venue: editVenue,
        services: editServices,
        notes: editNotes,
        status: editStatus,
      });
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
          <h2 className="font-display text-lg font-bold">Add event</h2>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Client / Organization <span className="text-gold-strong">*</span></label>
          <input className={inputBase} value={client} onChange={e => setClient(e.target.value)} placeholder="Summit Conferences" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Event Date</label>
            <input type="date" className={inputBase} value={eventDate} onChange={e => setEventDate(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Status</label>
            <select className={cn(inputBase, "cursor-pointer")} value={status} onChange={e => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Venue</label>
          <input className={inputBase} value={venue} onChange={e => setVenue(e.target.value)} placeholder="City Event Center" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Services</label>
          <input className={inputBase} value={services} onChange={e => setServices(e.target.value)} placeholder="Sound, Lighting, Live Stream" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Notes</label>
          <textarea className={cn(inputBase, "resize-y")} value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Any notes…" />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 text-sm font-medium text-gold-ink shadow-gold transition-all hover:-translate-y-0.5 hover:shadow-gold-lg disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {isPending ? "Adding…" : "Add event"}
        </button>
      </form>

      {/* List */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gold" />
          <h2 className="font-display text-xl font-bold">Booked events</h2>
          <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{events.length}</span>
        </div>

        {events.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">No events yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {events.map((ev) => (
              <li key={ev.id} className="rounded-2xl border border-border surface-card p-4 shadow-soft">
                {editId === ev.id ? (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Client</label>
                      <input className={inputBase} value={editClient} onChange={e => setEditClient(e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Date</label>
                        <input type="date" className={inputBase} value={editDate} onChange={e => setEditDate(e.target.value)} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
                        <select className={cn(inputBase, "cursor-pointer")} value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Venue</label>
                      <input className={inputBase} value={editVenue} onChange={e => setEditVenue(e.target.value)} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Services</label>
                      <input className={inputBase} value={editServices} onChange={e => setEditServices(e.target.value)} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Notes</label>
                      <textarea className={cn(inputBase, "resize-y")} value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={2} />
                    </div>
                    {editError && <p className="text-sm text-red-500">{editError}</p>}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2 text-sm font-medium text-gold-ink shadow-gold transition-all hover:-translate-y-0.5 disabled:opacity-60"
                      >
                        <Check className="h-4 w-4" />
                        {isPending ? "Saving…" : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditId(null)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{ev.client}</p>
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium ring-1", statusColors[ev.status] ?? statusColors.booked)}>
                          {ev.status}
                        </span>
                      </div>
                      {ev.event_date && <p className="text-xs text-muted-foreground">{ev.event_date}</p>}
                      {ev.venue && <p className="text-xs text-muted-foreground">{ev.venue}</p>}
                      {ev.services && <p className="text-xs text-muted-foreground">{ev.services}</p>}
                      {ev.notes && <p className="mt-1 text-xs text-muted-foreground italic">{ev.notes}</p>}
                      <p className="mt-1 text-xs text-muted-foreground/60">Added {formatDate(ev.created_at)}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(ev)}
                        disabled={isPending}
                        aria-label={`Edit event for ${ev.client}`}
                        className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground disabled:opacity-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(ev.id)}
                        disabled={isPending}
                        aria-label={`Delete event for ${ev.client}`}
                        className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-red-400/50 hover:text-red-500 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
