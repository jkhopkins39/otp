import "server-only";

import { randomUUID } from "node:crypto";
import { getSupabase } from "./supabase";
import { buildSeedPosts } from "./seed-posts";
import type { Post } from "./posts";

// ── Row → Post mapping ──────────────────────────────────────────
function rowToPost(row: Record<string, unknown>): Post {
  return {
    id: String(row.id),
    title: String(row.title),
    body: String(row.body ?? ""),
    videoId: String(row.video_id ?? ""),
    createdAt: Number(row.created_at),
    featured: Boolean(row.featured),
  };
}

// ── Read operations ─────────────────────────────────────────────

export async function listPosts(): Promise<Post[]> {
  const sb = getSupabase();
  if (!sb) return [...buildSeedPosts()].sort((a, b) => b.createdAt - a.createdAt);

  const { data } = await sb
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => rowToPost(row as Record<string, unknown>));
}

export async function getPost(id: string): Promise<Post | undefined> {
  const sb = getSupabase();
  if (!sb) return buildSeedPosts().find((p) => p.id === id);

  const { data } = await sb.from("posts").select("*").eq("id", id).single();
  return data ? rowToPost(data as Record<string, unknown>) : undefined;
}

export async function getFeaturedPost(): Promise<Post | null> {
  const sb = getSupabase();
  if (!sb) return buildSeedPosts()[0] ?? null;

  const { data } = await sb
    .from("posts")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(1);

  if (data && data.length > 0) return rowToPost(data[0] as Record<string, unknown>);

  // Fall back to most recent
  const { data: recent } = await sb
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  return recent && recent.length > 0
    ? rowToPost(recent[0] as Record<string, unknown>)
    : null;
}

// ── Write operations ────────────────────────────────────────────

export async function insertPost(data: {
  title: string;
  body: string;
  videoId: string;
}): Promise<Post> {
  const sb = getSupabase();
  if (!sb)
    throw new Error(
      "Database not configured. Add SUPABASE_URL and SUPABASE_SECRET_KEY to your Vercel project settings.",
    );

  const post: Post = {
    id: `post_${randomUUID()}`,
    title: data.title.trim(),
    body: data.body.trim(),
    videoId: data.videoId,
    createdAt: Date.now(),
    featured: false,
  };

  const { error } = await sb.from("posts").insert({
    id: post.id,
    title: post.title,
    body: post.body,
    video_id: post.videoId,
    created_at: post.createdAt,
    featured: false,
  });

  if (error) throw new Error(`Insert post failed: ${error.message}`);
  return post;
}

export async function deletePost(id: string): Promise<void> {
  const sb = getSupabase();
  if (!sb)
    throw new Error(
      "Database not configured. Add SUPABASE_URL and SUPABASE_SECRET_KEY to your Vercel project settings.",
    );

  const { error } = await sb.from("posts").delete().eq("id", id);
  if (error) throw new Error(`Delete post failed: ${error.message}`);
}

export async function setFeaturedPost(id: string): Promise<void> {
  const sb = getSupabase();
  if (!sb)
    throw new Error("Database not configured.");

  // Un-feature all posts, then feature the selected one
  await sb.from("posts").update({ featured: false }).neq("id", "");
  const { error } = await sb.from("posts").update({ featured: true }).eq("id", id);
  if (error) throw new Error(`Set featured failed: ${error.message}`);
}

export async function updatePost(
  id: string,
  data: { title: string; body: string; videoId: string },
): Promise<Post | undefined> {
  const sb = getSupabase();
  if (!sb) return undefined;

  const { error } = await sb
    .from("posts")
    .update({ title: data.title.trim(), body: data.body.trim(), video_id: data.videoId })
    .eq("id", id);

  if (error) throw new Error(`Update post failed: ${error.message}`);
  return getPost(id);
}
