import "server-only";

import fs from "node:fs";
import path from "node:path";
import { createClient, type Client } from "@libsql/client";
import { buildSeedPosts } from "./seed-posts";

/**
 * Database layer for the blog.
 *
 * - **Local dev:** SQLite file at `./data/otp.db` via libSQL (no native addons).
 * - **Vercel / serverless:** set `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` (free at turso.tech).
 * - **Vercel without Turso:** falls back to in-memory seed posts (read-only; admin writes won't persist).
 */

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS posts (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    body        TEXT NOT NULL DEFAULT '',
    video_id    TEXT NOT NULL DEFAULT '',
    created_at  INTEGER NOT NULL
  );
`;

type DbMode = "turso" | "file" | "memory";

const globalForDb = globalThis as unknown as {
  __otpDb?: Client;
  __otpDbReady?: Promise<void>;
  __otpDbMode?: DbMode;
};

function resolveDbMode(): DbMode {
  if (process.env.TURSO_DATABASE_URL) return "turso";
  if (process.env.VERCEL) return "memory";
  return "file";
}

function localDbPath(): string {
  return process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "otp.db");
}

function createConnection(): Client | null {
  const mode = resolveDbMode();
  globalForDb.__otpDbMode = mode;

  if (mode === "memory") return null;

  const url =
    mode === "turso"
      ? process.env.TURSO_DATABASE_URL!
      : `file:${localDbPath()}`;

  if (mode === "file") {
    fs.mkdirSync(path.dirname(localDbPath()), { recursive: true });
  }

  return createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

async function ensureSchema(client: Client): Promise<void> {
  await client.execute(SCHEMA);

  const result = await client.execute("SELECT COUNT(*) AS count FROM posts");
  const count = Number(result.rows[0]?.count ?? 0);
  if (count > 0) return;

  const seed = buildSeedPosts();
  for (const post of seed) {
    await client.execute({
      sql: "INSERT OR IGNORE INTO posts (id, title, body, video_id, created_at) VALUES (?, ?, ?, ?, ?)",
      args: [post.id, post.title, post.body, post.videoId, post.createdAt],
    });
  }
}

async function initDb(): Promise<void> {
  if (!globalForDb.__otpDb) {
    globalForDb.__otpDb = createConnection() ?? undefined;
  }

  if (globalForDb.__otpDb) {
    await ensureSchema(globalForDb.__otpDb);
  }
}

export async function getDbReady(): Promise<void> {
  if (!globalForDb.__otpDbReady) {
    globalForDb.__otpDbReady = initDb();
  }
  await globalForDb.__otpDbReady;
}

export async function getDbClient(): Promise<Client | null> {
  await getDbReady();
  return globalForDb.__otpDb ?? null;
}

export function getDbMode(): DbMode {
  return globalForDb.__otpDbMode ?? resolveDbMode();
}
