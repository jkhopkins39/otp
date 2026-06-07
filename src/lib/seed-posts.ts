import type { Post } from "./posts";

/** Default blog posts — used when seeding a fresh database or running in-memory on Vercel. */
export function buildSeedPosts(now = Date.now()): Post[] {
  return [
    {
      id: "seed_livestream",
      title: "What we set up for a live-streamed event",
      body: "A reliable stream is mostly about what happens before you go live. We arrive early, hard-wire the network where we can, run redundant audio off the board, and test the full chain — cameras, encoder, and the destination — well before doors open.\n\nThis post walks through a typical multi-camera conference setup: camera placement, getting clean audio from the room, and the backup plan for when the venue Wi-Fi inevitably gets crowded.",
      videoId: "",
      createdAt: now - 1000 * 60 * 60 * 24 * 3,
    },
    {
      id: "seed_avinstall",
      title: "Sound, lighting & streaming for a growing church",
      body: "When a room outgrows its old speakers, the fix usually isn't 'just add more.' We start by listening to the space, then design a system the volunteers can actually run on a Sunday morning — clear speech, simple controls, and a streaming feed that looks and sounds like you're in the room.",
      videoId: "",
      createdAt: now - 1000 * 60 * 60 * 24 * 9,
    },
  ];
}
