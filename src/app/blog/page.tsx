import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { PostFeed } from "@/components/blog/post-feed";
import { listPosts } from "@/lib/posts-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "News and updates from One Talent Productions — recent jobs, gear, and behind-the-scenes notes.",
};

export default async function BlogPage() {
  const posts = await listPosts();

  return (
    <>
      <PageHeader
        eyebrow="News & updates"
        title={
          <>
            Recent jobs, gear &amp; the{" "}
            <span className="text-gradient-gold">behind-the-scenes</span>.
          </>
        }
        description="Notes from the field — what we set up, what we learned, and a look behind the curtain."
      />
      <Section className="pt-12 sm:pt-14">
        <PostFeed posts={posts} />
      </Section>
    </>
  );
}
