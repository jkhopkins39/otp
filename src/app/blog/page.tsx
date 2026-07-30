import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { PostFeed } from "@/components/blog/post-feed";
import { listPosts } from "@/lib/posts-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Production updates, field notes, and AV tips from One Talent Productions in West Georgia.",
};

export default async function BlogPage() {
  const posts = await listPosts();

  return (
    <>
      <PageHeader
        title="News and updates from One Talent."
        description="Production updates and field notes from our AV and event production work across West Georgia."
      />
      <Section className="pt-10 sm:pt-12 lg:pt-14 pb-16 sm:pb-20 lg:pb-24">
        <PostFeed posts={posts} />
      </Section>
    </>
  );
}
