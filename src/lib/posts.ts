/**
 * Shared blog post types + validation.
 *
 * NOTE: This module is safe to import from both client and server. The actual
 * persistence (SQLite) lives in server-only modules (`db.ts` / `posts-store.ts`)
 * and all writes are gated behind admin auth in the server actions.
 */

export type Post = {
  id: string;
  title: string;
  /** Either body or videoId (or both) must be present. */
  body: string;
  /** Parsed 11-char YouTube id, or "" when no video. */
  videoId: string;
  createdAt: number;
};

export type PostDraft = {
  title: string;
  body: string;
  videoId: string;
};

/** Raw input sent from the composer to the server action. */
export type PostInput = {
  title: string;
  body: string;
  /** Raw YouTube URL or id, parsed + validated on the server. */
  videoInput: string;
};

export type ValidationErrors = {
  title?: string;
  content?: string;
  video?: string;
};

/**
 * Validation rule: a post needs a title AND at least one of
 * (body text | video). Both body and video may coexist.
 */
export function validateDraft(
  draft: PostDraft,
  videoInputRaw: string,
  videoIsValid: boolean,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!draft.title.trim()) {
    errors.title = "Give your post a title.";
  }

  const hasBody = draft.body.trim().length > 0;
  const hasVideoInput = videoInputRaw.trim().length > 0;

  if (hasVideoInput && !videoIsValid) {
    errors.video = "That doesn't look like a valid YouTube link or video ID.";
  }

  const hasUsableVideo = hasVideoInput && videoIsValid;

  if (!hasBody && !hasUsableVideo) {
    errors.content =
      "Add body text or a YouTube video — at least one is required.";
  }

  return errors;
}
