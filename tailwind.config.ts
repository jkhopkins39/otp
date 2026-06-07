import type { Config } from "tailwindcss";

/**
 * Design tokens are driven by CSS custom properties defined in globals.css.
 * Colors are stored as HSL channel triplets ("H S% L%") so Tailwind's
 * `<alpha-value>` opacity modifiers keep working (e.g. bg-gold/20).
 *
 * The gold accent hue intentionally SHIFTS between light and dark themes:
 *  - light: a deeper, warmer amber that reads cleanly on white
 *  - dark:  a more luminous, saturated gold that glows against black
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
        gold: {
          DEFAULT: token("--gold"),
          soft: token("--gold-soft"),
          strong: token("--gold-strong"),
          ink: token("--gold-ink"),
        },
        orange: {
          DEFAULT: token("--orange"),
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "serif"],
      },
      borderRadius: {
        sm: "0.5rem",
        DEFAULT: "0.75rem",
        md: "0.875rem",
        lg: "1.125rem",
        xl: "1.5rem",
        "2xl": "2rem",
      },
      boxShadow: {
        soft: "0 1px 2px hsl(var(--shadow-color) / 0.06), 0 8px 24px hsl(var(--shadow-color) / 0.08)",
        lift: "0 2px 4px hsl(var(--shadow-color) / 0.08), 0 18px 48px hsl(var(--shadow-color) / 0.14)",
        gold: "0 8px 30px hsl(var(--gold) / 0.35)",
        "gold-lg": "0 14px 50px hsl(var(--gold) / 0.45)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(110deg, hsl(var(--gold-soft)) 0%, hsl(var(--gold)) 42%, hsl(var(--orange)) 100%)",
        "brand-radial":
          "radial-gradient(120% 120% at 15% 10%, hsl(var(--gold-soft) / 0.85) 0%, transparent 55%), radial-gradient(120% 120% at 90% 25%, hsl(var(--orange) / 0.55) 0%, transparent 50%)",
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
