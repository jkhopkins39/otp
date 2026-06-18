"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Users, Pencil, Check, X, ChevronUp, ChevronDown } from "lucide-react";
import {
  createTeamMemberAction,
  deleteTeamMemberAction,
  updateTeamMemberAction,
  reorderTeamMembersAction,
} from "@/app/admin/actions";
import type { DbTeamMember } from "@/lib/site-store";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";

const inputBase =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground " +
  "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/60";

export function TeamSection({ members }: { members: DbTeamMember[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Add form
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [pfpUrl, setPfpUrl] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [addError, setAddError] = useState("");

  // Ordered list — mirrors server data, updated optimistically for reorder
  const [ordered, setOrdered] = useState<DbTeamMember[]>(members);
  useEffect(() => { setOrdered(members); }, [members]);

  // Inline edit
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editPfp, setEditPfp] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editError, setEditError] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    startTransition(async () => {
      const res = await createTeamMemberAction({ name, role, pfp_url: pfpUrl, bio, email });
      if (!res.ok) { setAddError(res.error); return; }
      setName(""); setRole(""); setPfpUrl(""); setBio(""); setEmail("");
      router.refresh();
    });
  }

  function startEdit(m: DbTeamMember) {
    setEditId(m.id);
    setEditName(m.name);
    setEditRole(m.role);
    setEditPfp(m.pfp_url);
    setEditBio(m.bio);
    setEditEmail(m.email);
    setEditError("");
  }

  function handleSaveEdit() {
    if (!editId) return;
    setEditError("");
    startTransition(async () => {
      const res = await updateTeamMemberAction(editId, {
        name: editName, role: editRole, pfp_url: editPfp, bio: editBio, email: editEmail,
      });
      if (!res.ok) { setEditError(res.error); return; }
      setEditId(null);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteTeamMemberAction(id);
      setOrdered(prev => prev.filter(m => m.id !== id));
      router.refresh();
    });
  }

  function handleMove(index: number, dir: -1 | 1) {
    const next = [...ordered];
    const other = index + dir;
    if (other < 0 || other >= next.length) return;
    [next[index], next[other]] = [next[other], next[index]];
    setOrdered(next);
    startTransition(async () => {
      await reorderTeamMembersAction(next.map(m => m.id));
      router.refresh();
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start">
      {/* Add form */}
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
          <label className="mb-1.5 block text-sm font-medium">
            Profile Photo <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </label>
          <ImageUpload value={pfpUrl} onChange={setPfpUrl} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Bio <span className="text-xs font-normal text-muted-foreground">(optional)</span></label>
          <textarea className={cn(inputBase, "resize-y")} value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Short bio…" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email <span className="text-xs font-normal text-muted-foreground">(optional — shown on About page)</span></label>
          <input className={inputBase} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="austin@example.com" />
        </div>

        {addError && <p className="text-sm text-red-500">{addError}</p>}

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
          <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{ordered.length}</span>
        </div>

        {ordered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">No team members yet.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {ordered.map((m, i) => (
              <li key={m.id} className="rounded-2xl border border-border surface-card shadow-soft">
                {editId === m.id ? (
                  <div className="flex flex-col gap-4 p-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Profile Photo</label>
                      <ImageUpload value={editPfp} onChange={setEditPfp} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">Name <span className="text-gold-strong">*</span></label>
                        <input className={inputBase} value={editName} onChange={e => setEditName(e.target.value)} required />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">Role <span className="text-gold-strong">*</span></label>
                        <input className={inputBase} value={editRole} onChange={e => setEditRole(e.target.value)} required />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Bio</label>
                      <textarea className={cn(inputBase, "resize-y")} value={editBio} onChange={e => setEditBio(e.target.value)} rows={3} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Email <span className="text-xs font-normal text-muted-foreground">(shown on About page)</span></label>
                      <input className={inputBase} type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="austin@example.com" />
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
                        {isPending ? "Saving…" : "Save changes"}
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
                  <div className="flex items-start gap-3 p-4">
                    <div className="flex flex-col items-center gap-0.5 pt-1">
                      <button
                        type="button"
                        onClick={() => handleMove(i, -1)}
                        disabled={isPending || i === 0}
                        aria-label="Move up"
                        className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(i, 1)}
                        disabled={isPending || i === ordered.length - 1}
                        aria-label="Move down"
                        className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
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
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(m)}
                        disabled={isPending}
                        aria-label={`Edit ${m.name}`}
                        className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground disabled:opacity-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id)}
                        disabled={isPending}
                        aria-label={`Delete ${m.name}`}
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
