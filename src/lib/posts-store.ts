import "server-only";

import { randomUUID } from "node:crypto";
import { getDb } from "./db";
import type { Post } from "./posts";

const SELECT_COLUMNS =
  "id, title, body, video_id AS videoId, created_at AS createdAt";

export function listPosts(): Post[] {
  return getDb()
    .prepare(`SELECT ${SELECT_COLUMNS} FROM posts ORDER BY created_at DESC`)
    .all() as Post[];
}

export function getPost(id: string): Post | undefined {
  return getDb()
    .prepare(`SELECT ${SELECT_COLUMNS} FROM posts WHERE id = ?`)
    .get(id) as Post | undefined;
}

export function insertPost(data: {
  title: string;
  body: string;
  videoId: string;
}): Post {
  const post: Post = {
    id: `post_${randomUUID()}`,
    title: data.title.trim(),
    body: data.body.trim(),
    videoId: data.videoId,
    createdAt: Date.now(),
  };

  getDb()
    .prepare(
      "INSERT INTO posts (id, title, body, video_id, created_at) VALUES (@id, @title, @body, @videoId, @createdAt)",
    )
    .run(post);

  return post;
}

export function updatePost(
  id: string,
  data: { title: string; body: string; videoId: string },
): Post | undefined {
  getDb()
    .prepare(
      "UPDATE posts SET title = @title, body = @body, video_id = @videoId WHERE id = @id",
    )
    .run({
      id,
      title: data.title.trim(),
      body: data.body.trim(),
      videoId: data.videoId,
    });
  return getPost(id);
}

export function deletePost(id: string): void {
  getDb().prepare("DELETE FROM posts WHERE id = ?").run(id);
}
