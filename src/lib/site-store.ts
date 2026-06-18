import "server-only";

import { getSupabase } from "./supabase";

// ── Types ────────────────────────────────────────────────────────

export type DbTeamMember = {
  id: string;
  name: string;
  role: string;
  pfp_url: string;
  bio: string;
  email: string;
  display_order: number;
};

export type DbVenue = {
  id: string;
  name: string;
  display_order: number;
};

export type DbJob = {
  id: string;
  title: string;
  category: string;
  year: string;
  blurb: string;
  featured: boolean;
  image_url: string;
  display_order: number;
};

export type DbBookedEvent = {
  id: string;
  client: string;
  event_date: string;
  venue: string;
  services: string;
  notes: string;
  status: string;
  created_at: number;
};

export type DbTestimonial = {
  id: string;
  quote: string;
  author_name: string;
  author_role: string;
  display_order: number;
};

export type DbContactSubmission = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  venue: string;
  expected_attendance: string;
  venue_type: string;
  services: string;
  setup_window: string;
  budget_range: string;
  referral_source: string;
  additional_details: string;
  archived: boolean;
  created_at: number;
};

// ── Seed data (shown when Supabase is not configured) ────────────

const SEED_VENUES: DbVenue[] = [
  { id: "1", name: "Grace Community Church", display_order: 1 },
  { id: "2", name: "Riverside Sports", display_order: 2 },
  { id: "3", name: "Summit Conferences", display_order: 3 },
  { id: "4", name: "City Event Center", display_order: 4 },
  { id: "5", name: "Cornerstone Church", display_order: 5 },
  { id: "6", name: "Metro Athletics", display_order: 6 },
  { id: "7", name: "Harbor Venue", display_order: 7 },
  { id: "8", name: "Lakeside Schools", display_order: 8 },
];

const SEED_TEAM: DbTeamMember[] = [
  {
    id: "1",
    name: "Austin Smith",
    role: "Founder & Lead Technician",
    pfp_url: "",
    bio: "Technical producer with hands-on experience in live streaming, sound, lighting, and AV installation. Based in West Georgia, focused on getting your event right from setup to teardown.",
    email: "",
    display_order: 0,
  },
];

const SEED_TESTIMONIALS: DbTestimonial[] = [
  {
    id: "1",
    quote: "They ran our entire conference stream without a single hiccup. We never had to think about the tech once.",
    author_name: "Events Lead",
    author_role: "Summit Conferences",
    display_order: 0,
  },
  {
    id: "2",
    quote: "Our new sanctuary sound and streaming system made a huge difference. Clear audio and simple enough for our volunteers to run every week.",
    author_name: "Pastor",
    author_role: "Cornerstone Church",
    display_order: 1,
  },
  {
    id: "3",
    quote: "Sound, lights, and a live feed for the whole tournament. Set up early and rock solid all weekend.",
    author_name: "Athletics Director",
    author_role: "Metro Athletics",
    display_order: 2,
  },
  {
    id: "4",
    quote: "From load-in to teardown they were calm, fast, and prepared. Exactly who you want running your event.",
    author_name: "Event Coordinator",
    author_role: "City Event Center",
    display_order: 3,
  },
];

const SEED_JOBS: DbJob[] = [
  { id: "1", title: "Corporate Summit Live Stream", category: "Live Stream", year: "2025", blurb: "Three-camera live broadcast of a two-day conference, streamed to remote attendees.", featured: true, image_url: "", display_order: 0 },
  { id: "2", title: "Regional Sports Broadcast", category: "Live Stream", year: "2025", blurb: "Multi-camera streaming setup for a regional tournament with live scoreboard integration.", featured: true, image_url: "", display_order: 1 },
  { id: "3", title: "Sanctuary AV Upgrade", category: "AV Install", year: "2025", blurb: "Full sound, lighting, and streaming system installed for a growing church in Georgia.", featured: true, image_url: "", display_order: 2 },
  { id: "4", title: "Spring Formal", category: "Sound & Lighting", year: "2024", blurb: "Stage lighting and sound for a school dance, built for the room and run all night.", featured: false, image_url: "", display_order: 3 },
  { id: "5", title: "Community Concert", category: "Sound & Lighting", year: "2024", blurb: "Front-of-house mix and stage lighting for an outdoor community concert.", featured: false, image_url: "", display_order: 4 },
  { id: "6", title: "Event Recap Film", category: "Video", year: "2023", blurb: "Highlight recap video cut from a full weekend conference.", featured: false, image_url: "", display_order: 5 },
];

// ── Helper ───────────────────────────────────────────────────────

function notConfiguredError(op: string): Error {
  return new Error(
    `${op}: Supabase not configured. Add SUPABASE_URL and SUPABASE_SECRET_KEY to your environment variables.`,
  );
}

// ── Team Members ─────────────────────────────────────────────────

export async function listTeamMembers(): Promise<DbTeamMember[]> {
  const sb = getSupabase();
  if (!sb) return SEED_TEAM;
  const { data } = await sb.from("team_members").select("*").order("display_order");
  return (data ?? []) as DbTeamMember[];
}

export async function insertTeamMember(input: {
  name: string;
  role: string;
  pfp_url: string;
  bio: string;
  email: string;
}): Promise<DbTeamMember> {
  const sb = getSupabase();
  if (!sb) throw notConfiguredError("insertTeamMember");

  const { data: existing } = await sb
    .from("team_members")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);

  const next_order = existing && existing.length > 0
    ? (existing[0].display_order as number) + 1
    : 0;

  const { data, error } = await sb
    .from("team_members")
    .insert({ ...input, display_order: next_order })
    .select()
    .single();

  if (error) throw new Error(`insertTeamMember: ${error.message}`);
  return data as DbTeamMember;
}

export async function deleteTeamMember(id: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw notConfiguredError("deleteTeamMember");
  const { error } = await sb.from("team_members").delete().eq("id", id);
  if (error) throw new Error(`deleteTeamMember: ${error.message}`);
}

export async function updateTeamMember(
  id: string,
  input: { name: string; role: string; pfp_url: string; bio: string; email: string },
): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw notConfiguredError("updateTeamMember");
  const { error } = await sb.from("team_members").update(input).eq("id", id);
  if (error) throw new Error(`updateTeamMember: ${error.message}`);
}

export async function reorderTeamMembers(orderedIds: string[]): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw notConfiguredError("reorderTeamMembers");
  await Promise.all(
    orderedIds.map((id, i) =>
      sb.from("team_members").update({ display_order: i }).eq("id", id),
    ),
  );
}

// ── Venues ───────────────────────────────────────────────────────

export async function listVenues(): Promise<DbVenue[]> {
  const sb = getSupabase();
  if (!sb) return SEED_VENUES;
  const { data } = await sb.from("venues").select("*").order("display_order");
  return (data ?? []) as DbVenue[];
}

export async function insertVenue(name: string): Promise<DbVenue> {
  const sb = getSupabase();
  if (!sb) throw notConfiguredError("insertVenue");

  const { data: existing } = await sb
    .from("venues")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);

  const next_order = existing && existing.length > 0
    ? (existing[0].display_order as number) + 1
    : 0;

  const { data, error } = await sb
    .from("venues")
    .insert({ name: name.trim(), display_order: next_order })
    .select()
    .single();

  if (error) throw new Error(`insertVenue: ${error.message}`);
  return data as DbVenue;
}

export async function deleteVenue(id: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw notConfiguredError("deleteVenue");
  const { error } = await sb.from("venues").delete().eq("id", id);
  if (error) throw new Error(`deleteVenue: ${error.message}`);
}

export async function updateVenue(id: string, name: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw notConfiguredError("updateVenue");
  const { error } = await sb.from("venues").update({ name: name.trim() }).eq("id", id);
  if (error) throw new Error(`updateVenue: ${error.message}`);
}

// ── Jobs ─────────────────────────────────────────────────────────

export async function listJobs(): Promise<DbJob[]> {
  const sb = getSupabase();
  if (!sb) return SEED_JOBS;
  const { data } = await sb.from("jobs").select("*").order("display_order");
  return (data ?? []) as DbJob[];
}

export async function insertJob(input: {
  title: string;
  category: string;
  year: string;
  blurb: string;
  featured: boolean;
  image_url: string;
}): Promise<DbJob> {
  const sb = getSupabase();
  if (!sb) throw notConfiguredError("insertJob");

  const { data: existing } = await sb
    .from("jobs")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);

  const next_order = existing && existing.length > 0
    ? (existing[0].display_order as number) + 1
    : 0;

  const { data, error } = await sb
    .from("jobs")
    .insert({ ...input, display_order: next_order })
    .select()
    .single();

  if (error) throw new Error(`insertJob: ${error.message}`);
  return data as DbJob;
}

export async function deleteJob(id: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw notConfiguredError("deleteJob");
  const { error } = await sb.from("jobs").delete().eq("id", id);
  if (error) throw new Error(`deleteJob: ${error.message}`);
}

export async function updateJob(
  id: string,
  input: Partial<Pick<DbJob, "title" | "category" | "year" | "blurb" | "featured" | "image_url">>,
): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw notConfiguredError("updateJob");
  const { error } = await sb.from("jobs").update(input).eq("id", id);
  if (error) throw new Error(`updateJob: ${error.message}`);
}

// ── Booked Events ────────────────────────────────────────────────

export async function listBookedEvents(): Promise<DbBookedEvent[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("booked_events")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as DbBookedEvent[];
}

export async function insertBookedEvent(input: {
  client: string;
  event_date: string;
  venue: string;
  services: string;
  notes: string;
  status: string;
}): Promise<DbBookedEvent> {
  const sb = getSupabase();
  if (!sb) throw notConfiguredError("insertBookedEvent");

  const { data, error } = await sb
    .from("booked_events")
    .insert({ ...input, created_at: Date.now() })
    .select()
    .single();

  if (error) throw new Error(`insertBookedEvent: ${error.message}`);
  return data as DbBookedEvent;
}

export async function deleteBookedEvent(id: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw notConfiguredError("deleteBookedEvent");
  const { error } = await sb.from("booked_events").delete().eq("id", id);
  if (error) throw new Error(`deleteBookedEvent: ${error.message}`);
}

export async function updateBookedEvent(
  id: string,
  input: Partial<Pick<DbBookedEvent, "client" | "event_date" | "venue" | "services" | "notes" | "status">>,
): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw notConfiguredError("updateBookedEvent");
  const { error } = await sb.from("booked_events").update(input).eq("id", id);
  if (error) throw new Error(`updateBookedEvent: ${error.message}`);
}

// ── Testimonials ─────────────────────────────────────────────────

export async function listTestimonials(): Promise<DbTestimonial[]> {
  const sb = getSupabase();
  if (!sb) return SEED_TESTIMONIALS;
  const { data } = await sb.from("testimonials").select("*").order("display_order");
  return (data ?? []) as DbTestimonial[];
}

export async function insertTestimonial(input: {
  quote: string;
  author_name: string;
  author_role: string;
}): Promise<DbTestimonial> {
  const sb = getSupabase();
  if (!sb) throw notConfiguredError("insertTestimonial");

  const { data: existing } = await sb
    .from("testimonials")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);

  const next_order = existing && existing.length > 0
    ? (existing[0].display_order as number) + 1
    : 0;

  const { data, error } = await sb
    .from("testimonials")
    .insert({ ...input, display_order: next_order })
    .select()
    .single();

  if (error) throw new Error(`insertTestimonial: ${error.message}`);
  return data as DbTestimonial;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw notConfiguredError("deleteTestimonial");
  const { error } = await sb.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(`deleteTestimonial: ${error.message}`);
}

export async function updateTestimonial(
  id: string,
  input: { quote: string; author_name: string; author_role: string },
): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw notConfiguredError("updateTestimonial");
  const { error } = await sb.from("testimonials").update(input).eq("id", id);
  if (error) throw new Error(`updateTestimonial: ${error.message}`);
}

// ── Contact Submissions ──────────────────────────────────────────

export async function listContactSubmissions(includeArchived = false): Promise<DbContactSubmission[]> {
  const sb = getSupabase();
  if (!sb) return [];
  let query = sb
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (!includeArchived) {
    query = query.eq("archived", false);
  }
  const { data } = await query;
  return (data ?? []) as DbContactSubmission[];
}

export async function archiveContactSubmission(id: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw notConfiguredError("archiveContactSubmission");
  const { error } = await sb
    .from("contact_submissions")
    .update({ archived: true })
    .eq("id", id);
  if (error) throw new Error(`archiveContactSubmission: ${error.message}`);
}

export async function unarchiveContactSubmission(id: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw notConfiguredError("unarchiveContactSubmission");
  const { error } = await sb
    .from("contact_submissions")
    .update({ archived: false })
    .eq("id", id);
  if (error) throw new Error(`unarchiveContactSubmission: ${error.message}`);
}

export async function insertContactSubmission(
  input: Omit<DbContactSubmission, "id" | "created_at" | "archived">,
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return; // Silently skip — Web3Forms still delivers the email

  await sb
    .from("contact_submissions")
    .insert({ ...input, created_at: Date.now() });
}
