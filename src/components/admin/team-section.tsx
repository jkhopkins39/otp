"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Users } from "lucide-react";
import { createTeamMemberAction, deleteTeamMemberAction } from "@/app/admin/actions";
import type { DbTeamMember } from "@/lib/site-store";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground " +
  "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/60";

export function TeamSection({ members }: { members: DbTeamMember[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [pfpUrl, setPfpUrl] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await createTeamMemberAction({ name, role, pfp_url: pfpUrl, bio });
      if (!res.ok) { setError(res.error); return; }
      setName(""); setRole(""); setPfpUrl(""); setBio("");
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteTeamMemberAction(id);
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
          <h2 className="font-display text-lg font-bold">Add team member</h2>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Name <span className="text-gold-strong">*</span></label>
          <input className={inputBase} value={name} onChange={e => setName(e.target.value)} placeholder="Austin Smith" required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Role <span className="text-gold-strong">*</span></label>
          <input className={inputBase} value={role} onChange={e => setRole(e.target.value)} placeholder="Lead Technician" required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Profile Photo URL <span className="text-xs font-normal text-muted-foreground">(optional)</span></label>
          <input className={inputBase} value={pfpUrl} onChange={e => setPfpUrl(e.target.value)} placeholder="https://…" type="url" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Bio <span className="text-xs font-normal text-muted-foreground">(optional)</span></label>
          <textarea className={cn(inputBase, "resize-y")} value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Short bio…" />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 text-sm font-medium text-gold-ink shadow-gold transition-all hover:-translate-y-0.5 hover:shadow-gold-lg disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {isPending ? "Adding…" : "Add member"}
        </button>
      </form>

      {/* List */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-gold" />
          <h2 className="font-display text-xl font-bold">Team members</h2>
          <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{members.length}</span>
        </div>

        {members.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">No team members yet.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {members.map((m) => (
              <li key={m.id} className="flex items-start gap-4 rounded-2xl border border-border surface-card p-4 shadow-soft">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-gold-soft/40 via-gold/30 to-orange/30 font-display text-lg font-bold text-gold-ink/70">
                  {m.pfp_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.pfp_url} alt={m.name} className="h-full w-full object-cover" />
                  ) : (
                    m.name.split(" ").map(n => n[0]).join("")
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-gold-strong">{m.role}</p>
                  {m.bio && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{m.bio}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(m.id)}
                  disabled={isPending}
                  aria-label={`Delete ${m.name}`}
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
