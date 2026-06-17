"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import { getAuthClient } from "@/lib/supabase-auth";
import { insertPost, deletePost, setFeaturedPost } from "@/lib/posts-store";
import {
  validateDraft,
  type PostInput,
  type ValidationErrors,
} from "@/lib/posts";
import { parseYouTubeId } from "@/lib/youtube";
import {
  insertTeamMember,
  deleteTeamMember,
  updateTeamMember,
  reorderTeamMembers,
  insertVenue,
  deleteVenue,
  insertJob,
  deleteJob,
  insertBookedEvent,
  deleteBookedEvent,
  insertTestimonial,
  deleteTestimonial,
} from "@/lib/site-store";

// ── Auth ─────────────────────────────────────────────────────────

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
    return { error: "Supabase is not configured." };
  }

  const supabase = await getAuthClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: "Invalid email or password." };

  redirect("/admin");
}

export async function logout(): Promise<void> {
  const supabase = await getAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ── Blog Posts ───────────────────────────────────────────────────

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

  await insertPost({
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

  await deletePost(id);
  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

export async function setFeaturedPostAction(id: string): Promise<{ ok: boolean }> {
  if (!(await isAuthed())) return { ok: false };

  await setFeaturedPost(id);
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

// ── Team Members ─────────────────────────────────────────────────

export type TeamMemberResult = { ok: true } | { ok: false; error: string };

export async function createTeamMemberAction(input: {
  name: string;
  role: string;
  pfp_url: string;
  bio: string;
}): Promise<TeamMemberResult> {
  if (!(await isAuthed())) return { ok: false, error: "Not authenticated." };
  if (!input.name.trim()) return { ok: false, error: "Name is required." };
  if (!input.role.trim()) return { ok: false, error: "Role is required." };

  try {
    await insertTeamMember(input);
  } catch (e) {
    return { ok: false, error: String(e) };
  }

  revalidatePath("/about");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteTeamMemberAction(id: string): Promise<{ ok: boolean }> {
  if (!(await isAuthed())) return { ok: false };
  await deleteTeamMember(id);
  revalidatePath("/about");
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateTeamMemberAction(
  id: string,
  input: { name: string; role: string; pfp_url: string; bio: string },
): Promise<TeamMemberResult> {
  if (!(await isAuthed())) return { ok: false, error: "Not authenticated." };
  if (!input.name.trim()) return { ok: false, error: "Name is required." };
  if (!input.role.trim()) return { ok: false, error: "Role is required." };

  try {
    await updateTeamMember(id, input);
  } catch (e) {
    return { ok: false, error: String(e) };
  }

  revalidatePath("/about");
  revalidatePath("/admin");
  return { ok: true };
}

export async function reorderTeamMembersAction(orderedIds: string[]): Promise<{ ok: boolean }> {
  if (!(await isAuthed())) return { ok: false };

  try {
    await reorderTeamMembers(orderedIds);
  } catch {
    return { ok: false };
  }

  revalidatePath("/about");
  revalidatePath("/admin");
  return { ok: true };
}

// ── Venues ───────────────────────────────────────────────────────

export type VenueResult = { ok: true } | { ok: false; error: string };

export async function createVenueAction(name: string): Promise<VenueResult> {
  if (!(await isAuthed())) return { ok: false, error: "Not authenticated." };
  if (!name.trim()) return { ok: false, error: "Venue name is required." };

  try {
    await insertVenue(name);
  } catch (e) {
    return { ok: false, error: String(e) };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteVenueAction(id: string): Promise<{ ok: boolean }> {
  if (!(await isAuthed())) return { ok: false };
  await deleteVenue(id);
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

// ── Jobs ─────────────────────────────────────────────────────────

export type JobResult = { ok: true } | { ok: false; error: string };

export async function createJobAction(input: {
  title: string;
  category: string;
  year: string;
  blurb: string;
  featured: boolean;
}): Promise<JobResult> {
  if (!(await isAuthed())) return { ok: false, error: "Not authenticated." };
  if (!input.title.trim()) return { ok: false, error: "Title is required." };

  try {
    await insertJob(input);
  } catch (e) {
    return { ok: false, error: String(e) };
  }

  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteJobAction(id: string): Promise<{ ok: boolean }> {
  if (!(await isAuthed())) return { ok: false };
  await deleteJob(id);
  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/admin");
  return { ok: true };
}

// ── Booked Events ────────────────────────────────────────────────

export type EventResult = { ok: true } | { ok: false; error: string };

export async function createBookedEventAction(input: {
  client: string;
  event_date: string;
  venue: string;
  services: string;
  notes: string;
  status: string;
}): Promise<EventResult> {
  if (!(await isAuthed())) return { ok: false, error: "Not authenticated." };
  if (!input.client.trim()) return { ok: false, error: "Client name is required." };

  try {
    await insertBookedEvent(input);
  } catch (e) {
    return { ok: false, error: String(e) };
  }

  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteBookedEventAction(id: string): Promise<{ ok: boolean }> {
  if (!(await isAuthed())) return { ok: false };
  await deleteBookedEvent(id);
  revalidatePath("/admin");
  return { ok: true };
}

// ── Testimonials ─────────────────────────────────────────────────

export type TestimonialResult = { ok: true } | { ok: false; error: string };

export async function createTestimonialAction(input: {
  quote: string;
  author_name: string;
  author_role: string;
}): Promise<TestimonialResult> {
  if (!(await isAuthed())) return { ok: false, error: "Not authenticated." };
  if (!input.quote.trim()) return { ok: false, error: "Quote is required." };
  if (!input.author_name.trim()) return { ok: false, error: "Author name is required." };

  try {
    await insertTestimonial(input);
  } catch (e) {
    return { ok: false, error: String(e) };
  }

  revalidatePath("/portfolio");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteTestimonialAction(id: string): Promise<{ ok: boolean }> {
  if (!(await isAuthed())) return { ok: false };
  await deleteTestimonial(id);
  revalidatePath("/portfolio");
  revalidatePath("/admin");
  return { ok: true };
}
