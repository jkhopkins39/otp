import "server-only";

import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

/**
 * SQLite is used as a small, self-contained datastore that requires no external
 * service. It persists to a file on disk, so it works in local dev and on any
 * host with a persistent filesystem (a VPS, a container, etc.).
 *
 * Heads-up for serverless hosts (e.g. Vercel): the filesystem is ephemeral and
 * read-only at runtime, so SQLite will NOT persist there. If you deploy
 * serverless, point this layer at a hosted database (Postgres/Neon/Turso) by
 * swapping the implementation in this file — the rest of the app only talks to
 * `posts-store.ts`.
 */

const DB_PATH =
  process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "otp.db");

function createConnection(): Database.Database {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  // Wait (instead of throwing SQLITE_BUSY) if another process holds a lock.
  db.pragma("busy_timeout = 5000");
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      body        TEXT NOT NULL DEFAULT '',
      video_id    TEXT NOT NULL DEFAULT '',
      created_at  INTEGER NOT NULL
    );
  `);

  seedIfEmpty(db);
  return db;
}

function seedIfEmpty(db: Database.Database) {
  const { count } = db
    .prepare("SELECT COUNT(*) AS count FROM posts")
    .get() as { count: number };
  if (count > 0) return;

  const now = Date.now();
  const seed = [
    {
      id: "seed_livestream",
      title: "What we set up for a live-streamed event",
      body: "A reliable stream is mostly about what happens before you go live. We arrive early, hard-wire the network where we can, run redundant audio off the board, and test the full chain — cameras, encoder, and the destination — well before doors open.\n\nThis post walks through a typical multi-camera conference setup: camera placement, getting clean audio from the room, and the backup plan for when the venue Wi-Fi inevitably gets crowded.",
      video_id: "",
      created_at: now - 1000 * 60 * 60 * 24 * 3,
    },
    {
      id: "seed_avinstall",
      title: "Sound, lighting & streaming for a growing church",
      body: "When a room outgrows its old speakers, the fix usually isn't 'just add more.' We start by listening to the space, then design a system the volunteers can actually run on a Sunday morning — clear speech, simple controls, and a streaming feed that looks and sounds like you're in the room.",
      video_id: "",
      created_at: now - 1000 * 60 * 60 * 24 * 9,
    },
  ];

  const insert = db.prepare(
    "INSERT OR IGNORE INTO posts (id, title, body, video_id, created_at) VALUES (@id, @title, @body, @video_id, @created_at)",
  );
  const insertMany = db.transaction((rows: typeof seed) => {
    for (const row of rows) insert.run(row);
  });
  insertMany(seed);
}

// Cache the connection across hot reloads in development. The connection is
// created lazily on first use so that simply importing this module (e.g. while
// Next collects page data during a build) doesn't open or write to the file.
const globalForDb = globalThis as unknown as { __otpDb?: Database.Database };

export function getDb(): Database.Database {
  if (!globalForDb.__otpDb) {
    globalForDb.__otpDb = createConnection();
  }
  return globalForDb.__otpDb;
}
