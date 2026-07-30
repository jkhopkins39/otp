import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { Testimonials } from "@/components/work/testimonials";
import { listTestimonials } from "@/lib/site-store";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Client Reviews",
  description:
    "Reviews from churches, venues, and event teams who have worked with One Talent Productions for AV, sound, and lighting in Georgia.",
};

export default async function PortfolioPage() {
  const testimonials = await listTestimonials();

  return (
    <>
      <PageHeader
        title="What our clients say."
        description="Reviews from churches, venues, and event teams we have worked with across Georgia."
      />

      <Section className="pt-10 sm:pt-12 lg:pt-14">
        {testimonials.length > 0 ? (
          <Testimonials testimonials={testimonials} />
        ) : (
          <p className="text-center text-muted-foreground">Reviews coming soon.</p>
        )}
      </Section>
    </>
  );
}
