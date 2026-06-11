"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText, Inbox } from "lucide-react";
import { PostCard } from "./post-card";
import { deletePostAction } from "@/app/admin/actions";
import type { Post } from "@/lib/posts";

export function PostFeed({
  posts,
  admin = false,
}: {
  posts: Post[];
  /** Show admin controls (delete) and wire them to the secured server action. */
  admin?: boolean;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      await deletePostAction(id);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 font-display text-xl font-bold">
          <FileText className="h-5 w-5 text-gold" />
          Latest posts
        </h2>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </span>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border surface-readable px-6 py-16 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold">
            <Inbox className="h-7 w-7" />
          </span>
          <p className="font-display text-lg font-bold">No posts yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {admin
              ? "Publish your first post using the form."
              : "Check back soon — new posts will show up here."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={admin ? handleDelete : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
