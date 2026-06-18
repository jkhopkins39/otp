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
  logoSrc: "/assets/otp-logo.png",
  tagline: "AV production, sound, and lighting for events in West Georgia.",
  description:
    "One Talent Productions is an AV and event production company based in West Georgia, GA. We handle live streaming, sound, lighting, video, and AV installation for churches, venues, corporate events, concerts, and sports.",
  email: "onetalentproductions@gmail.com",
  phone: "+1 (770) 820-8594",
  location: "West Georgia, GA",
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
  { label: "Work", href: "/work" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
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
      "Multi-camera live streaming for corporate events, conferences, church services, and sports across Georgia.",
    icon: Radio,
  },
  {
    title: "Sound & Audio",
    description:
      "Professional PA systems and live audio mixing for concerts, church services, and events of any size.",
    icon: Volume2,
  },
  {
    title: "Lighting & Staging",
    description:
      "Stage and event lighting for concerts, services, and productions in West Georgia.",
    icon: Lightbulb,
  },
  {
    title: "Video Production",
    description:
      "On-site video capture and recap edits for events, conferences, and productions.",
    icon: Video,
  },
  {
    title: "AV Installation",
    description:
      "Permanent sound, video, and streaming systems installed for churches, venues, and event spaces in Georgia.",
    icon: Cable,
  },
  {
    title: "Maintenance & Support",
    description:
      "AV maintenance, troubleshooting, and on-call support for installed systems.",
    icon: Wrench,
  },
];

export type Project = {
  title: string;
  category: string;
  year: string;
  blurb: string;
  accent: string;
  featured?: boolean;
  image_url?: string;
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
    blurb: "Multi-camera streaming setup for a regional tournament with live scoreboard integration.",
    accent: "from-yellow-300 via-amber-500 to-orange-600",
    featured: true,
  },
  {
    title: "Sanctuary AV Upgrade",
    category: "AV Install",
    year: "2025",
    blurb: "Full sound, lighting, and streaming system installed for a growing church in Georgia.",
    accent: "from-orange-300 via-amber-500 to-yellow-500",
    featured: true,
  },
  {
    title: "Spring Formal",
    category: "Sound & Lighting",
    year: "2024",
    blurb: "Stage lighting and sound for a school dance, built for the room and run all night.",
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
      "Our new sanctuary sound and streaming system made a huge difference. Clear audio and simple enough for our volunteers to run every week.",
    name: "Pastor",
    role: "Cornerstone Church",
  },
  {
    quote:
      "Sound, lights, and a live feed for the whole tournament. Set up early and rock solid all weekend.",
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
      "Our name comes from the parable of the talents (Matthew 25). Whatever we are trusted with, we put to work.",
    icon: HeartHandshake,
  },
  {
    title: "Show-ready, every time",
    description:
      "Gear tested, backups ready, set up early. When it is go time, it just works.",
    icon: ShieldCheck,
  },
  {
    title: "The right gear for the job",
    description:
      "The correct equipment, properly configured and maintained for your space and your event.",
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

export const stats = [
  { value: "200+", label: "Events covered" },
  { value: "75+", label: "Live streams run" },
  { value: "20+", label: "Venues equipped" },
  { value: "8 yrs", label: "In the field" },
];
