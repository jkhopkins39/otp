import "server-only";

import { randomUUID } from "node:crypto";
import { getDbClient, getDbMode } from "./db";
import { buildSeedPosts } from "./seed-posts";
import type { Post } from "./posts";

const SELECT_COLUMNS =
  "id, title, body, video_id AS videoId, created_at AS createdAt";

const globalForMemory = globalThis as unknown as {
  __otpMemoryPosts?: Post[];
};

function memoryPosts(): Post[] {
  if (!globalForMemory.__otpMemoryPosts) {
    globalForMemory.__otpMemoryPosts = buildSeedPosts();
  }
  return globalForMemory.__otpMemoryPosts;
}

function rowToPost(row: Record<string, unknown>): Post {
  return {
    id: String(row.id),
    title: String(row.title),
    body: String(row.body),
    videoId: String(row.videoId ?? row.video_id ?? ""),
    createdAt: Number(row.createdAt ?? row.created_at),
  };
}

export async function listPosts(): Promise<Post[]> {
  const client = await getDbClient();
  if (!client) {
    return [...memoryPosts()].sort((a, b) => b.createdAt - a.createdAt);
  }

  const result = await client.execute(
    `SELECT ${SELECT_COLUMNS} FROM posts ORDER BY created_at DESC`,
  );
  return result.rows.map((row) => rowToPost(row as Record<string, unknown>));
}

export async function getPost(id: string): Promise<Post | undefined> {
  const client = await getDbClient();
  if (!client) {
    return memoryPosts().find((post) => post.id === id);
  }

  const result = await client.execute({
    sql: `SELECT ${SELECT_COLUMNS} FROM posts WHERE id = ?`,
    args: [id],
  });
  const row = result.rows[0];
  return row ? rowToPost(row as Record<string, unknown>) : undefined;
}

export async function insertPost(data: {
  title: string;
  body: string;
  videoId: string;
}): Promise<Post> {
  const post: Post = {
    id: `post_${randomUUID()}`,
    title: data.title.trim(),
    body: data.body.trim(),
    videoId: data.videoId,
    createdAt: Date.now(),
  };

  const client = await getDbClient();
  if (!client) {
    if (getDbMode() === "memory") {
      throw new Error(
        "Blog writes are not persisted on Vercel without Turso. Add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in your Vercel project settings.",
      );
    }
    throw new Error("Database is unavailable.");
  }

  await client.execute({
    sql: "INSERT INTO posts (id, title, body, video_id, created_at) VALUES (?, ?, ?, ?, ?)",
    args: [post.id, post.title, post.body, post.videoId, post.createdAt],
  });

  return post;
}

export async function updatePost(
  id: string,
  data: { title: string; body: string; videoId: string },
): Promise<Post | undefined> {
  const client = await getDbClient();
  if (!client) return undefined;

  await client.execute({
    sql: "UPDATE posts SET title = ?, body = ?, video_id = ? WHERE id = ?",
    args: [data.title.trim(), data.body.trim(), data.videoId, id],
  });
  return getPost(id);
}

export async function deletePost(id: string): Promise<void> {
  const client = await getDbClient();
  if (!client) {
    if (getDbMode() === "memory") {
      throw new Error(
        "Blog writes are not persisted on Vercel without Turso. Add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in your Vercel project settings.",
      );
    }
    throw new Error("Database is unavailable.");
  }

  await client.execute({
    sql: "DELETE FROM posts WHERE id = ?",
    args: [id],
  });
}
