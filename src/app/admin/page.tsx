import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, LogOut } from "lucide-react";
import { isAuthed } from "@/lib/auth";
import { logout } from "./actions";
import { listPosts } from "@/lib/posts-store";
import {
  listTeamMembers,
  listVenues,
  listJobs,
  listBookedEvents,
  listTestimonials,
  listContactSubmissions,
} from "@/lib/site-store";
import { TabNav } from "@/components/admin/tab-nav";
import { PostForm } from "@/components/blog/post-form";
import { PostFeed } from "@/components/blog/post-feed";
import { TeamSection } from "@/components/admin/team-section";
import { VenuesSection } from "@/components/admin/venues-section";
import { JobsSection } from "@/components/admin/jobs-section";
import { EventsSection } from "@/components/admin/events-section";
import { TestimonialsSection } from "@/components/admin/testimonials-section";
import { ContactsSection } from "@/components/admin/contacts-section";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const VALID_TABS = ["blog", "team", "venues", "jobs", "events", "testimonials", "contacts"] as const;
type Tab = (typeof VALID_TABS)[number];

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  if (!(await isAuthed())) redirect("/admin/login");

  const params = await searchParams;
  const tab = (VALID_TABS.includes(params.tab as Tab) ? params.tab : "blog") as Tab;

  // Fetch only what's needed for the active tab
  const [posts, team, venues, jobs, events, testimonials, contacts] =
    await Promise.all([
      tab === "blog" ? listPosts() : Promise.resolve([]),
      tab === "team" ? listTeamMembers() : Promise.resolve([]),
      tab === "venues" ? listVenues() : Promise.resolve([]),
      tab === "jobs" ? listJobs() : Promise.resolve([]),
      tab === "events" ? listBookedEvents() : Promise.resolve([]),
      tab === "testimonials" ? listTestimonials() : Promise.resolve([]),
      tab === "contacts" ? listContactSubmissions() : Promise.resolve([]),
    ]);

  return (
    <section className="container py-10 sm:py-14">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-strong">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground"
          >
            View site
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

      <TabNav activeTab={tab} />

      {tab === "blog" && (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start lg:gap-12">
          <div className="lg:sticky lg:top-24">
            <PostForm />
          </div>
          <PostFeed posts={posts} admin />
        </div>
      )}

      {tab === "team" && <TeamSection members={team} />}
      {tab === "venues" && <VenuesSection venues={venues} />}
      {tab === "jobs" && <JobsSection jobs={jobs} />}
      {tab === "events" && <EventsSection events={events} />}
      {tab === "testimonials" && <TestimonialsSection testimonials={testimonials} />}
      {tab === "contacts" && <ContactsSection submissions={contacts} />}
    </section>
  );
}
