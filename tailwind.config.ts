import type { Config } from "tailwindcss";

/**
 * Design tokens are driven by CSS custom properties defined in globals.css.
 * Colors are stored as HSL channel triplets ("H S% L%") so Tailwind's
 * `<alpha-value>` opacity modifiers keep working (e.g. bg-gold/20).
 *
 * There is ONE accent: signal orange. The legacy `gold*` / `orange` color names
 * are retained (they are referenced widely, including /admin) but they all map
 * onto that single accent scale:
 *   gold-soft   decorative tint only
 *   gold        signal orange — fills, rules, icons, borders (non-text)
 *   gold-strong accessible accent — text and text-bearing fills (AA in both themes)
 *   gold-ink    ink that sits on a gold-strong fill
 */
function token(variable: string) {
  return `hsl(var(${variable}) / <alpha-value>)`;
}

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        background: token("--background"),
        foreground: token("--foreground"),
        card: token("--card"),
        "card-foreground": token("--card-foreground"),
        muted: token("--muted"),
        "muted-foreground": token("--muted-foreground"),
        border: token("--border"),
        ring: token("--ring"),
        destructive: token("--destructive"),
        gold: {
          DEFAULT: token("--gold"),
          soft: token("--gold-soft"),
          strong: token("--gold-strong"),
          // Hover fill for solid accent buttons. Darkens on light, brightens on
          // dark, so `text-gold-ink` stays ≥4.5:1 in both themes.
          hover: token("--gold-strong-hover"),
          ink: token("--gold-ink"),
        },
        orange: {
          DEFAULT: token("--orange"),
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      /**
       * Monotonic radius scale. The old scale left `3xl` at Tailwind's default
       * 1.5rem, which rendered SMALLER than the overridden `2xl` (2rem).
       * Standard: buttons/inputs 8px · cards & media 12px · large slabs 16px.
       */
      borderRadius: {
        none: "0px",
        sm: "0.25rem" /*  4px — checkboxes, tiny chips */,
        DEFAULT: "0.5rem" /*  8px — buttons, inputs */,
        md: "0.5rem" /*  8px — buttons, inputs */,
        lg: "0.625rem" /* 10px */,
        xl: "0.75rem" /* 12px — cards, media */,
        "2xl": "0.75rem" /* 12px — cards, panels */,
        "3xl": "1rem" /* 16px — large slabs */,
        full: "9999px",
      },
      boxShadow: {
        soft: "0 1px 2px hsl(var(--shadow-color) / 0.05), 0 4px 12px hsl(var(--shadow-color) / 0.06)",
        lift: "0 1px 2px hsl(var(--shadow-color) / 0.06), 0 10px 28px hsl(var(--shadow-color) / 0.10)",
        // Legacy names, de-glowed: the accent no longer casts colored light.
        gold: "0 1px 2px hsl(var(--shadow-color) / 0.05), 0 4px 12px hsl(var(--shadow-color) / 0.06)",
        "gold-lg":
          "0 1px 2px hsl(var(--shadow-color) / 0.06), 0 10px 28px hsl(var(--shadow-color) / 0.10)",
      },
      /**
       * Legacy utility names, flat fills. `bg-brand-gradient` resolves to the
       * accessible accent so any `text-gold-ink` paired with it stays AA.
       */
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(0deg, hsl(var(--gold-strong)) 0%, hsl(var(--gold-strong)) 100%)",
        "brand-radial":
          "linear-gradient(0deg, hsl(var(--muted)) 0%, hsl(var(--muted)) 100%)",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease forwards",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
