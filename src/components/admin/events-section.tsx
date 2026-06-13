"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Calendar } from "lucide-react";
import { createBookedEventAction, deleteBookedEventAction } from "@/app/admin/actions";
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
  const [client, setClient] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [venue, setVenue] = useState("");
  const [services, setServices] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("booked");
  const [error, setError] = useState("");

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
              <li key={ev.id} className="flex items-start gap-3 rounded-2xl border border-border surface-card p-4 shadow-soft">
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
                <button
                  type="button"
                  onClick={() => handleDelete(ev.id)}
                  disabled={isPending}
                  aria-label={`Delete event for ${ev.client}`}
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
