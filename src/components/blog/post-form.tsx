"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, CheckCircle2, Send, Youtube } from "lucide-react";
import { parseYouTubeId } from "@/lib/youtube";
import { validateDraft, type ValidationErrors } from "@/lib/posts";
import { createPostAction } from "@/app/admin/actions";
import { YouTubeEmbed } from "./youtube-embed";
import { cn } from "@/lib/utils";

const MAX_TITLE = 120;

export function PostForm() {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [videoInput, setVideoInput] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const videoId = useMemo(() => parseYouTubeId(videoInput), [videoInput]);
  const videoIsValid = videoId !== null;
  const hasVideoInput = videoInput.trim().length > 0;

  function runValidation(): ValidationErrors {
    const next = validateDraft(
      { title, body, videoId: videoId ?? "" },
      videoInput,
      videoIsValid,
    );
    setErrors(next);
    return next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    const validation = runValidation();
    if (Object.keys(validation).length > 0) return;

    startTransition(async () => {
      const result = await createPostAction({ title, body, videoInput });
      if (!result.ok) {
        setErrors(result.errors);
        return;
      }

      setTitle("");
      setBody("");
      setVideoInput("");
      setErrors({});
      setTouched(false);
      setJustSaved(true);
      router.refresh();
      window.setTimeout(() => setJustSaved(false), 2600);
    });
  }

  const fieldError = (msg?: string) =>
    msg ? (
      <motion.p
        initial={reduce ? false : { opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-1.5 flex items-center gap-1.5 text-sm text-red-500"
        role="alert"
      >
        <AlertCircle className="h-4 w-4 shrink-0" />
        {msg}
      </motion.p>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-2xl border border-border surface-card p-6 shadow-soft sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-gold-ink shadow-gold">
          <Send className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold">Write a new post</h2>
          <p className="text-sm text-muted-foreground">
            Add body text, a YouTube video, or both.
          </p>
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="post-title" className="mb-1.5 block text-sm font-medium">
          Title
        </label>
        <input
          id="post-title"
          type="text"
          value={title}
          maxLength={MAX_TITLE}
          onChange={(e) => {
            setTitle(e.target.value);
            if (touched) runValidation();
          }}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "err-title" : undefined}
          placeholder="Behind the scenes of our latest shoot"
          className={cn(
            "w-full rounded-xl border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/70",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            errors.title ? "border-red-400" : "border-border",
          )}
        />
        <div id="err-title">{fieldError(errors.title)}</div>
      </div>

      {/* Body */}
      <div>
        <label htmlFor="post-body" className="mb-1.5 block text-sm font-medium">
          Body text{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="post-body"
          value={body}
          rows={4}
          onChange={(e) => {
            setBody(e.target.value);
            if (touched) runValidation();
          }}
          aria-invalid={!!errors.content}
          placeholder="Tell the story... Press Enter twice to start a new paragraph."
          className={cn(
            "w-full resize-y rounded-xl border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/70",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            errors.content ? "border-red-400" : "border-border",
          )}
        />
      </div>

      {/* Video */}
      <div>
        <label htmlFor="post-video" className="mb-1.5 block text-sm font-medium">
          YouTube URL or video ID{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <div className="relative">
          <Youtube className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            id="post-video"
            type="text"
            inputMode="url"
            value={videoInput}
            onChange={(e) => {
              setVideoInput(e.target.value);
              if (touched) runValidation();
            }}
            aria-invalid={!!errors.video}
            placeholder="https://youtube.com/watch?v=…  or  dQw4w9WgXcQ"
            className={cn(
              "w-full rounded-xl border bg-background py-3 pl-11 pr-10 text-foreground placeholder:text-muted-foreground/70",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              errors.video
                ? "border-red-400"
                : videoIsValid
                  ? "border-gold/60"
                  : "border-border",
            )}
          />
          {hasVideoInput && videoIsValid ? (
            <CheckCircle2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-500" />
          ) : null}
        </div>
        {fieldError(errors.video)}

        <AnimatePresence>
          {videoIsValid ? (
            <motion.div
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reduce ? undefined : { opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <p className="mb-2 mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Preview
              </p>
              <YouTubeEmbed videoId={videoId!} title="Video preview" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Content rule error (text or video) */}
      {fieldError(errors.content)}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        <p className="text-xs text-muted-foreground">
          Published live to your blog for everyone to see.
        </p>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {justSaved ? (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400"
              >
                <CheckCircle2 className="h-4 w-4" />
                Published
              </motion.span>
            ) : null}
          </AnimatePresence>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 text-sm font-medium text-gold-ink shadow-gold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-gold-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Publishing…" : "Publish post"}
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </form>
  );
}
