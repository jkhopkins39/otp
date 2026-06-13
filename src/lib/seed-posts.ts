import type { Post } from "./posts";

export function buildSeedPosts(now = Date.now()): Post[] {
  return [
    {
      id: "seed_livestream",
      title: "How we set up a multi-camera live stream",
      body: "A reliable stream starts before you go live. We arrive early, hard-wire the network where possible, run redundant audio off the board, and test the full chain: cameras, encoder, and destination, well before doors open.\n\nThis post covers a typical multi-camera conference setup: camera placement, clean audio from the room, and the backup plan for when venue Wi-Fi gets crowded.",
      videoId: "",
      createdAt: now - 1000 * 60 * 60 * 24 * 3,
      featured: true,
    },
    {
      id: "seed_avinstall",
      title: "AV installation for a growing church in West Georgia",
      body: "When a room outgrows its old speakers, adding more is usually not the fix. We start by listening to the space, then design a system volunteers can actually run on Sunday morning. Clear speech, simple controls, and a streaming feed that sounds like you are in the room.",
      videoId: "",
      createdAt: now - 1000 * 60 * 60 * 24 * 9,
      featured: false,
    },
  ];
}
