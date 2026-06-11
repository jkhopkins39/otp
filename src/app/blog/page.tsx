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
        eyebrow="News & updates"
        title={
          <>
            News and updates from{" "}
            <span className="text-gradient-gold">One Talent</span>.
          </>
        }
        description="Production updates and field notes from our AV and event production work across West Georgia."
      />
      <Section className="pt-4 sm:pt-5 lg:pt-6 pb-16 sm:pb-20 lg:pb-24">
        <PostFeed posts={posts} />
      </Section>
    </>
  );
}
