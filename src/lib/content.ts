/**
 * ───────────────────────────────────────────────────────────────
 * SITE CONTENT — edit this file to customize copy & data.
 * Portfolio items, services, clients, testimonials, and team all
 * live here so non-developers can swap content without touching JSX.
 * ───────────────────────────────────────────────────────────────
 */
import type { LucideIcon } from "lucide-react";
import {
  Radio,
  Volume2,
  Lightbulb,
  Video,
  Cable,
  Wrench,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";

export const site = {
  name: "One Talent Productions",
  shortName: "One Talent",
  /** Navbar / footer coin mark (public/assets). */
  logoSrc: "/assets/otp-logo.png",
  tagline: "Sound, light, and stream handled so your event just works.",
  description:
    "One Talent Productions is a technical event-production company: live streaming, sound, lighting, video, and AV installation for corporate events, sports, concerts, churches, and venues.",
  email: "TBD",
  phone: "+1 (770) 820-8594",
  location: "TBD",
  socials: [
    { label: "Instagram (TBD)", href: "https://instagram.com" },
    { label: "YouTube (TBD)", href: "https://youtube.com" },
    { label: "Facebook", href: "https://www.facebook.com/share/1LXMTyabat/?mibextid=wwXIfr" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/christopher-smith-499945155/" },
  ],
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
];

export type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    title: "Live Streaming & Broadcast",
    description:
      "Multi-camera live streams for corporate events, conferences, and sports",
    icon: Radio,
  },
  {
    title: "Sound & Audio",
    description:
      "PA systems, live mixing, and clear, balanced audio for concerts, services, and events of any size.",
    icon: Volume2,
  },
  {
    title: "Lighting & Staging",
    description:
      "Stage and event lighting designed and run to set the mood and keep focus where it belongs.",
    icon: Lightbulb,
  },
  {
    title: "Video Production",
    description:
      "On-site capture and recap edits that let your event live on after the lights come down.",
    icon: Video,
  },
  {
    title: "AV Installation",
    description:
      "Permanent sound, video, and streaming systems installed for churches, venues, and event spaces.",
    icon: Cable,
  },
  {
    title: "Maintenance & Support",
    description:
      "Ongoing upkeep, troubleshooting, and on-call support so your gear is ready every single time.",
    icon: Wrench,
  },
];

export type Project = {
  title: string;
  category: string;
  year: string;
  blurb: string;
  /** Tailwind gradient classes used for the placeholder art. Swap for <Image> later. */
  accent: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "Corporate Summit Live Stream",
    category: "Live Stream",
    year: "2025",
    blurb: "Three-camera live broadcast of a two-day conference, streamed to remote attendees.",
    accent: "from-amber-400 via-orange-500 to-rose-500",
    featured: true,
  },
  {
    title: "Regional Sports Broadcast",
    category: "Live Stream",
    year: "2025",
    blurb: "Multi-cam streaming setup for a regional tournament, with live scoreboard integration.",
    accent: "from-yellow-300 via-amber-500 to-orange-600",
    featured: true,
  },
  {
    title: "Sanctuary AV Upgrade",
    category: "AV Install",
    year: "2025",
    blurb: "Full sound, lighting, and streaming system installed for a growing church.",
    accent: "from-orange-300 via-amber-500 to-yellow-500",
    featured: true,
  },
  {
    title: "Spring Formal",
    category: "Sound & Lighting",
    year: "2024",
    blurb: "Stage lighting and sound for a school dance — built for the room, run all night.",
    accent: "from-amber-500 via-orange-600 to-red-600",
  },
  {
    title: "Community Concert",
    category: "Sound & Lighting",
    year: "2024",
    blurb: "Front-of-house mix and stage lighting for an outdoor community concert.",
    accent: "from-yellow-400 via-amber-500 to-orange-500",
  },
  {
    title: "Event Recap Film",
    category: "Video",
    year: "2023",
    blurb: "Highlight recap video cut from a full weekend conference.",
    accent: "from-amber-300 via-yellow-500 to-orange-400",
  },
];

// Placeholder client names — swap for the real organizations served.
export const clients = [
  "Grace Community Church",
  "Riverside Sports",
  "Summit Conferences",
  "City Event Center",
  "Cornerstone Church",
  "Metro Athletics",
  "Harbor Venue",
  "Lakeside Schools",
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "They ran our entire conference stream without a single hiccup. We never had to think about the tech once.",
    name: "Events Lead",
    role: "Summit Conferences",
  },
  {
    quote:
      "Our new sanctuary sound and streaming setup is night and day — clear audio, and easy for our volunteers to run.",
    name: "Pastor",
    role: "Cornerstone Church",
  },
  {
    quote:
      "Sound, lights, and a live feed for the whole tournament — set up early and rock solid all weekend.",
    name: "Athletics Director",
    role: "Metro Athletics",
  },
  {
    quote:
      "From load-in to teardown they were calm, fast, and prepared. Exactly who you want running your event.",
    name: "Event Coordinator",
    role: "City Event Center",
  },
];

export type Value = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const values: Value[] = [
  {
    title: "Faithful with every detail",
    description:
      "Our name comes from the parable of the talents (Matthew 25): whatever we're trusted with, we put to work and steward well.",
    icon: HeartHandshake,
  },
  {
    title: "Show-ready, every time",
    description:
      "Gear tested, backups ready, set up early. When it's go time, it just works — no surprises.",
    icon: ShieldCheck,
  },
  {
    title: "The right tool, dialed in",
    description:
      "We're technical first — the correct equipment, properly configured and maintained for your space and your event.",
    icon: Wrench,
  },
];

export type TeamMember = {
  name: string;
  role: string;
  initials: string;
};

export const team: TeamMember[] = [
  { name: "Austin Smith", role: "Founder & Lead Technician", initials: "AS" },
];

// Placeholder figures — update with real numbers.
export const stats = [
  { value: "200+", label: "Events covered" },
  { value: "75+", label: "Live streams run" },
  { value: "20+", label: "Venues equipped" },
  { value: "8 yrs", label: "On the job" },
];
