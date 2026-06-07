# One Talent Productions — Marketing Website

A production-grade marketing site for **One Talent Productions**, a full-service creative studio. Built with **Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion**.

Features a premium **gold → orange** brand identity, a polished **light/dark theme** where the gold hue _shifts_ between modes, and a fully functional **blog** (text + YouTube posts) persisted in the browser — no backend required.

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start the dev server                         |
| `npm run build`     | Production build (also runs type checking)   |
| `npm run start`     | Serve the production build                   |
| `npm run lint`      | ESLint (next/core-web-vitals)                |
| `npm run typecheck` | `tsc --noEmit` type check only               |

**Requirements:** Node 18.18+ (developed on Node 24).

---

## Pages

| Route        | What's there                                                            |
| ------------ | ----------------------------------------------------------------------- |
| `/`          | Hero with brand gradient, animated stats, services, featured work, CTA  |
| `/about`     | Company story, ethos quote, stats, values, team                         |
| `/portfolio` | Filterable work grid (layout-animated), client logos, testimonials      |
| `/blog`      | Create/list posts with text and/or YouTube video, saved to localStorage |

---

## Color palette

Tokens live as **HSL channel triplets** in [`src/app/globals.css`](src/app/globals.css) and are wired into Tailwind in [`tailwind.config.ts`](tailwind.config.ts). The neutral (white ↔ black) **and** the gold accent hue swap together between themes — this is intentional.

### Light mode (gold tuned for white)

| Token            | HSL              | Notes                          |
| ---------------- | ---------------- | ------------------------------ |
| `--background`   | `40 56% 99%`     | Warm near-white                |
| `--foreground`   | `24 45% 12%`     | Deep brown (`≈ #2E1809`)       |
| `--gold-soft`    | `44 96% 62%`     | Bright highlight gold          |
| `--gold`         | `38 94% 48%`     | **Deep warm amber** (hue ~38)  |
| `--gold-strong`  | `30 95% 46%`     | Toward orange                  |
| `--orange`       | `22 92% 52%`     | Gradient terminus (`≈ #F97316`)|
| `--gold-ink`     | `24 70% 18%`     | Brown text-on-gold contrast    |

### Dark mode (gold tuned to glow on black)

| Token            | HSL              | Notes                              |
| ---------------- | ---------------- | ---------------------------------- |
| `--background`   | `26 22% 5%`      | Warm near-black                    |
| `--foreground`   | `40 38% 93%`     | Warm off-white                     |
| `--gold-soft`    | `47 100% 72%`    | Luminous highlight                 |
| `--gold`         | `43 100% 60%`    | **Luminous saturated gold** (~43)  |
| `--gold-strong`  | `36 100% 56%`    | Toward orange                      |
| `--orange`       | `26 98% 58%`     | Gradient terminus                  |
| `--gold-ink`     | `26 60% 9%`      | Dark text-on-gold contrast         |

The hue moves from a **deeper amber (~38°)** in light mode to a **more luminous, fully saturated gold (~43°)** in dark mode, so the brand reads cleanly on white and glows against black.

### Theming mechanics

- `darkMode: "class"` in Tailwind; `.dark` on `<html>` flips every token.
- An inline script ([`src/components/theme/theme-script.tsx`](src/components/theme/theme-script.tsx)) runs **before first paint** to read `localStorage` → fall back to `prefers-color-scheme`, preventing any flash of the wrong theme (FOUC).
- [`ThemeProvider`](src/components/theme/theme-provider.tsx) persists the choice to `localStorage` (`otp.theme`) and live-reacts to OS changes only while the user hasn't made an explicit choice.
- The toggle ([`theme-toggle.tsx`](src/components/theme/theme-toggle.tsx)) uses a Framer Motion `layout` spring so the knob morphs between sides.

---

## Blog: persistence & validation

Logic lives in [`src/lib/posts.ts`](src/lib/posts.ts); UI in [`src/components/blog/`](src/components/blog).

### Persistence

- Posts are stored in `localStorage` under the key **`otp.blog.posts.v1`**.
- On first load the store is seeded with **2 example posts** (one text-only, one with a YouTube video) so the feed is never empty.
- Create and delete both write through to `localStorage` immediately. The feed only renders after mount (showing skeletons first) to avoid hydration mismatches.

### Validation rule

A post requires a **title** _and_ **at least one of**: body text **or** a valid YouTube video. Both may coexist.

- Empty title → inline error.
- A video value that can't be parsed → inline error.
- Neither body nor a usable video → inline "Add body text or a YouTube video" error.

Errors render inline with `role="alert"`. Validation runs on submit and live-updates once the form has been touched.

### YouTube handling

[`src/lib/youtube.ts`](src/lib/youtube.ts) parses a wide range of inputs into an 11-char video ID:

- raw ID (`dQw4w9WgXcQ`)
- `watch?v=`, `youtu.be/`, `/embed/`, `/shorts/`, `/live/` URLs, with extra query params/timestamps

The embed ([`youtube-embed.tsx`](src/components/blog/youtube-embed.tsx)) is a **facade**: it shows a styled thumbnail with a gradient play button and only injects the `youtube-nocookie` iframe after the user clicks — fast feed, premium framing (rounded corners, aspect-ratio box, gold ring + shadow).

---

## Customizing content

Almost all copy and data is centralized in **[`src/lib/content.ts`](src/lib/content.ts)**:

| Edit this export | To change                                |
| ---------------- | ---------------------------------------- |
| `site`           | Name, tagline, email, phone, socials     |
| `nav`            | Header/footer navigation links           |
| `services`       | Services grid (Home)                     |
| `projects`       | Portfolio items (`featured: true` = Home)|
| `clients`        | Client logo names                        |
| `testimonials`   | Testimonial quotes                       |
| `values`, `team`, `stats` | About page content              |

Other customization points:

- **Brand colors** → [`src/app/globals.css`](src/app/globals.css) (`:root` and `.dark`).
- **Logo** → `public/assets/logo.png` (used in nav, footer, hero card).
- **Seed blog posts** → `seedPosts` in [`src/lib/posts.ts`](src/lib/posts.ts).

> Portfolio cards use gradient placeholder art (`accent` Tailwind classes). To use real images, swap the gradient `<div>` in [`project-card.tsx`](src/components/work/project-card.tsx) for a `next/image`.

---

## Motion & accessibility

- **Spring physics** for structural entrances, the nav active pill, filter pills, and the theme knob.
- **Staggered** list/grid entrances (~0.06s/item) via Framer Motion variants.
- **Layout animations** (`layout` / `layoutId`) for the theme toggle, nav indicator, portfolio filtering, and blog post expand.
- Every animation respects **`prefers-reduced-motion`** (via `useReducedMotion`) — reduced-motion users get static, calm rendering.
- Semantic HTML (`<main>`, `<nav>`, `<section>`, `<article>`), keyboard-navigable controls, visible focus rings, a skip link, `aria-*` on the toggle/menu/forms, and AA-contrast text in both themes.

---

## File structure

```
otp/
├── public/
│   └── assets/logo.png
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout: fonts, theme bootstrap, nav, footer
│   │   ├── globals.css         # Design tokens (light + dark) & base styles
│   │   ├── page.tsx            # Home
│   │   ├── about/page.tsx
│   │   ├── portfolio/page.tsx
│   │   └── blog/page.tsx
│   ├── components/
│   │   ├── theme/              # theme-script, provider, toggle
│   │   ├── layout/             # navbar, footer
│   │   ├── ui/                 # button, section, logo, reveal, page-header, motion
│   │   ├── home/               # hero
│   │   ├── work/               # project-card, portfolio-gallery, client-marquee, testimonials
│   │   └── blog/               # blog-client, post-form, post-card, youtube-embed
│   └── lib/
│       ├── content.ts          # ← site copy & data (edit here)
│       ├── posts.ts            # blog storage + validation
│       ├── youtube.ts          # YouTube URL/ID parsing + embed helpers
│       └── utils.ts            # cn(), id + date helpers
├── tailwind.config.ts
├── next.config.mjs
├── postcss.config.mjs
└── tsconfig.json
```

---

## Tech stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS 3.4** with CSS-variable design tokens
- **Framer Motion 11** for spring/layout/stagger animation
- **lucide-react** icons
