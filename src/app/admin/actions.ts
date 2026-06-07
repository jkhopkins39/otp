"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createSession,
  destroySession,
  isAuthed,
  verifyPassword,
} from "@/lib/auth";
import { insertPost, deletePost } from "@/lib/posts-store";
import {
  validateDraft,
  type PostInput,
  type ValidationErrors,
} from "@/lib/posts";
import { parseYouTubeId } from "@/lib/youtube";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET) {
    return {
      error:
        "Admin login isn't configured. Set ADMIN_PASSWORD and SESSION_SECRET.",
    };
  }

  if (!verifyPassword(password)) {
    return { error: "Incorrect password." };
  }

  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

export type CreateResult =
  | { ok: true }
  | { ok: false; errors: ValidationErrors };

export async function createPostAction(
  input: PostInput,
): Promise<CreateResult> {
  if (!(await isAuthed())) {
    return { ok: false, errors: { content: "You must be signed in." } };
  }

  const videoId = parseYouTubeId(input.videoInput ?? "");
  const errors = validateDraft(
    { title: input.title, body: input.body, videoId: videoId ?? "" },
    input.videoInput ?? "",
    videoId !== null,
  );

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  insertPost({
    title: input.title,
    body: input.body,
    videoId: videoId ?? "",
  });

  revalidatePath("/blog");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deletePostAction(id: string): Promise<{ ok: boolean }> {
  if (!(await isAuthed())) return { ok: false };

  deletePost(id);
  revalidatePath("/blog");
  revalidatePath("/admin");
  return { ok: true };
}
