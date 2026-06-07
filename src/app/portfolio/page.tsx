import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { Testimonials } from "@/components/work/testimonials";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What clients say about working with One Talent Productions on live streaming, sound, lighting, video, and AV installation.",
};

export default function PortfolioPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reviews"
        title={
          <>
            Don&apos;t take our word for it —{" "}
            <span className="text-gradient-gold">take theirs</span>.
          </>
        }
        description="A few words from the churches, venues, and teams we've worked with."
      />

      <Section className="pt-12 sm:pt-14 lg:pt-16">
        <Testimonials />
      </Section>
    </>
  );
}
