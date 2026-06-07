import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, LogOut } from "lucide-react";
import { isAuthed } from "@/lib/auth";
import { logout } from "./actions";
import { listPosts } from "@/lib/posts-store";
import { PostForm } from "@/components/blog/post-form";
import { PostFeed } from "@/components/blog/post-feed";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAuthed())) redirect("/admin/login");

  const posts = listPosts();

  return (
    <section className="container py-12 sm:py-16">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-strong">
            Admin
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">
            Manage the blog
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground"
          >
            View blog
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-red-400/50 hover:text-red-500"
            >
              Sign out
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start lg:gap-12">
        <div className="lg:sticky lg:top-24">
          <PostForm />
        </div>
        <PostFeed posts={posts} admin />
      </div>
    </section>
  );
}
