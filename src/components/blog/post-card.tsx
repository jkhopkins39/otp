"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Trash2, ChevronDown, Star, Pencil, Check, X, Youtube } from "lucide-react";
import type { Post } from "@/lib/posts";
import { validateDraft, type ValidationErrors } from "@/lib/posts";
import { parseYouTubeId } from "@/lib/youtube";
import { formatDate } from "@/lib/utils";
import { updatePostAction } from "@/app/admin/actions";
import { YouTubeEmbed } from "./youtube-embed";
import { riseItem } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground " +
  "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/60 transition-colors";

export function PostCard({
  post,
  onDelete,
  onToggleFeatured,
}: {
  post: Post;
  onDelete?: (id: string) => void;
  onToggleFeatured?: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Read mode state
  const [expanded, setExpanded] = useState(false);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editVideoInput, setEditVideoInput] = useState("");
  const [editErrors, setEditErrors] = useState<ValidationErrors>({});
  const [editError, setEditError] = useState("");

  const editVideoId = useMemo(() => parseYouTubeId(editVideoInput), [editVideoInput]);

  function openEdit() {
    setEditTitle(post.title);
    setEditBody(post.body);
    setEditVideoInput(post.videoId);
    setEditErrors({});
    setEditError("");
    setIsEditing(true);
  }

  function handleSave() {
    const errors = validateDraft(
      { title: editTitle, body: editBody, videoId: editVideoId ?? "" },
      editVideoInput,
      editVideoId !== null,
    );
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    startTransition(async () => {
      const res = await updatePostAction(post.id, {
        title: editTitle,
        body: editBody,
        videoInput: editVideoInput,
      });
      if (!res.ok) {
        if ("errors" in res) setEditErrors(res.errors);
        else setEditError("Save failed.");
        return;
      }
      setIsEditing(false);
      router.refresh();
    });
  }

  const paragraphs = post.body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const isLong = post.body.length > 280 || paragraphs.length > 2;
  const visible = expanded || !isLong ? paragraphs : paragraphs.slice(0, 1);

  return (
    <motion.article
      layout={!reduce}
      variants={reduce ? undefined : riseItem}
      className="group relative overflow-hidden rounded-2xl border border-border surface-card shadow-soft transition-shadow hover:shadow-lift"
    >
      {post.featured && !isEditing && (
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold-strong ring-1 ring-gold/30">
          <Star className="h-3 w-3 fill-gold-strong" />
          Featured
        </div>
      )}
      <div
        className="absolute inset-x-0 top-0 h-0.5 bg-brand-gradient opacity-60"
        aria-hidden
      />

      {isEditing ? (
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-muted-foreground">Edit post</p>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-full border border-border p-1.5 text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Title</label>
            <input
              className={cn(inputBase, editErrors.title ? "border-red-400" : "")}
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              placeholder="Post title"
            />
            {editErrors.title && <p className="mt-1 text-xs text-red-500">{editErrors.title}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Body <span className="text-xs font-normal text-muted-foreground">(optional)</span></label>
            <textarea
              className={cn(inputBase, "resize-y")}
              value={editBody}
              onChange={e => setEditBody(e.target.value)}
              rows={4}
              placeholder="Post body…"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">YouTube URL or video ID <span className="text-xs font-normal text-muted-foreground">(optional)</span></label>
            <div className="relative">
              <Youtube className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className={cn(inputBase, "pl-10", editErrors.video ? "border-red-400" : editVideoId ? "border-gold/60" : "")}
                value={editVideoInput}
                onChange={e => setEditVideoInput(e.target.value)}
                placeholder="https://youtube.com/watch?v=…"
              />
            </div>
            {editErrors.video && <p className="mt-1 text-xs text-red-500">{editErrors.video}</p>}
            {editVideoId && (
              <div className="mt-3">
                <YouTubeEmbed videoId={editVideoId} title="Preview" />
              </div>
            )}
          </div>

          {editErrors.content && <p className="text-sm text-red-500">{editErrors.content}</p>}
          {editError && <p className="text-sm text-red-500">{editError}</p>}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2 text-sm font-medium text-gold-ink shadow-gold transition-all hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Check className="h-4 w-4" />
              {isPending ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5 text-gold" />
                {formatDate(post.createdAt)}
              </span>
              <h3 className="font-display text-2xl font-bold leading-tight tracking-tight">
                {post.title}
              </h3>
            </div>

            {(onDelete || onToggleFeatured) && (
              <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                {onToggleFeatured && (
                  <button
                    type="button"
                    onClick={() => onToggleFeatured(post.id)}
                    aria-label={post.featured ? "Remove featured" : "Feature this post on the homepage"}
                    title={post.featured ? "Remove featured" : "Set as homepage featured post"}
                    className={`rounded-full border p-2 transition-all ${
                      post.featured
                        ? "border-gold/50 text-gold-strong"
                        : "border-border text-muted-foreground hover:border-gold/50 hover:text-gold-strong"
                    }`}
                  >
                    <Star className={`h-4 w-4 ${post.featured ? "fill-gold-strong" : ""}`} />
                  </button>
                )}
                {onDelete && (
                  <>
                    <button
                      type="button"
                      onClick={openEdit}
                      aria-label={`Edit post: ${post.title}`}
                      className="rounded-full border border-border p-2 text-muted-foreground transition-all hover:border-gold/50 hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(post.id)}
                      aria-label={`Delete post: ${post.title}`}
                      className="rounded-full border border-border p-2 text-muted-foreground transition-all hover:border-red-400/50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {post.videoId ? (
            <YouTubeEmbed videoId={post.videoId} title={post.title} />
          ) : null}

          {paragraphs.length > 0 ? (
            <motion.div layout={!reduce} className="flex flex-col gap-3">
              {visible.map((para, i) => (
                <p
                  key={i}
                  className="text-[0.975rem] leading-relaxed text-muted-foreground"
                >
                  {para}
                </p>
              ))}

              {isLong ? (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-gold-strong transition-colors hover:text-gold"
                >
                  {expanded ? "Show less" : "Read more"}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      expanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : null}
            </motion.div>
          ) : null}
        </div>
      )}
    </motion.article>
  );
}
