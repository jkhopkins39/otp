-- ================================================================
-- One Talent Productions — Supabase schema
-- Run this in the Supabase SQL editor (Database → SQL Editor → New query)
-- ================================================================

-- Blog posts
CREATE TABLE IF NOT EXISTS posts (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL DEFAULT '',
  video_id    TEXT NOT NULL DEFAULT '',
  created_at  BIGINT NOT NULL,
  featured    BOOLEAN NOT NULL DEFAULT FALSE
);

-- Team members (About page)
CREATE TABLE IF NOT EXISTS team_members (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL,
  pfp_url       TEXT NOT NULL DEFAULT '',
  bio           TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Venue names (rotating marquee on home page)
CREATE TABLE IF NOT EXISTS venues (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Recent jobs / portfolio items
CREATE TABLE IF NOT EXISTS jobs (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT NOT NULL,
  category      TEXT NOT NULL DEFAULT '',
  year          TEXT NOT NULL DEFAULT '',
  blurb         TEXT NOT NULL DEFAULT '',
  featured      BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Booked / upcoming events
CREATE TABLE IF NOT EXISTS booked_events (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client      TEXT NOT NULL,
  event_date  TEXT NOT NULL DEFAULT '',
  venue       TEXT NOT NULL DEFAULT '',
  services    TEXT NOT NULL DEFAULT '',
  notes       TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'booked',
  created_at  BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())::BIGINT * 1000)
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote         TEXT NOT NULL,
  author_name   TEXT NOT NULL,
  author_role   TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name           TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT NOT NULL DEFAULT '',
  event_type          TEXT NOT NULL DEFAULT '',
  event_date          TEXT NOT NULL DEFAULT '',
  venue               TEXT NOT NULL DEFAULT '',
  expected_attendance TEXT NOT NULL DEFAULT '',
  venue_type          TEXT NOT NULL DEFAULT '',
  services            TEXT NOT NULL DEFAULT '',
  setup_window        TEXT NOT NULL DEFAULT '',
  budget_range        TEXT NOT NULL DEFAULT '',
  referral_source     TEXT NOT NULL DEFAULT '',
  additional_details  TEXT NOT NULL DEFAULT '',
  created_at          BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW())::BIGINT * 1000)
);

-- ── Seed data ────────────────────────────────────────────────────

INSERT INTO venues (name, display_order) VALUES
  ('Grace Community Church', 1),
  ('Riverside Sports', 2),
  ('Summit Conferences', 3),
  ('City Event Center', 4),
  ('Cornerstone Church', 5),
  ('Metro Athletics', 6),
  ('Harbor Venue', 7),
  ('Lakeside Schools', 8)
ON CONFLICT DO NOTHING;

INSERT INTO team_members (name, role, pfp_url, bio, display_order) VALUES
  ('Austin Smith', 'Founder & Lead Technician', '',
   'Technical producer with hands-on experience in live streaming, sound, lighting, and AV installation. Based in West Georgia, focused on getting your event right from setup to teardown.',
   0)
ON CONFLICT DO NOTHING;

INSERT INTO testimonials (quote, author_name, author_role, display_order) VALUES
  ('They ran our entire conference stream without a single hiccup. We never had to think about the tech once.',
   'Events Lead', 'Summit Conferences', 0),
  ('Our new sanctuary sound and streaming system made a huge difference. Clear audio and simple enough for our volunteers to run every week.',
   'Pastor', 'Cornerstone Church', 1),
  ('Sound, lights, and a live feed for the whole tournament. Set up early and rock solid all weekend.',
   'Athletics Director', 'Metro Athletics', 2),
  ('From load-in to teardown they were calm, fast, and prepared. Exactly who you want running your event.',
   'Event Coordinator', 'City Event Center', 3)
ON CONFLICT DO NOTHING;

INSERT INTO jobs (title, category, year, blurb, featured, display_order) VALUES
  ('Corporate Summit Live Stream', 'Live Stream', '2025',
   'Three-camera live broadcast of a two-day conference, streamed to remote attendees.', TRUE, 0),
  ('Regional Sports Broadcast', 'Live Stream', '2025',
   'Multi-camera streaming setup for a regional tournament with live scoreboard integration.', TRUE, 1),
  ('Sanctuary AV Upgrade', 'AV Install', '2025',
   'Full sound, lighting, and streaming system installed for a growing church in Georgia.', TRUE, 2),
  ('Spring Formal', 'Sound & Lighting', '2024',
   'Stage lighting and sound for a school dance, built for the room and run all night.', FALSE, 3),
  ('Community Concert', 'Sound & Lighting', '2024',
   'Front-of-house mix and stage lighting for an outdoor community concert.', FALSE, 4),
  ('Event Recap Film', 'Video', '2023',
   'Highlight recap video cut from a full weekend conference.', FALSE, 5)
ON CONFLICT DO NOTHING;
