"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

/**
 * Accessible light/dark switch. The knob slides with a spring when the theme
 * changes — positioned absolutely so navbar layout shifts (e.g. scroll reset on
 * route change) never trigger a cross-screen animation.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const reduce = useReducedMotion();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-9 w-[4.25rem] shrink-0 items-center rounded-full border border-border",
        "bg-muted/70 p-1 transition-colors hover:border-gold/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span className="sr-only">Toggle color theme</span>

      {/* Static track icons */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 text-muted-foreground">
        <Sun className="h-4 w-4" aria-hidden />
        <Moon className="h-4 w-4" aria-hidden />
      </span>

      {/* Sliding knob — absolute + translateX only; no layout prop */}
      <motion.span
        aria-hidden
        className="absolute top-1 left-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-gold-ink shadow-gold"
        animate={{ x: isDark ? 32 : 0 }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: "spring", stiffness: 500, damping: 32 }
        }
      >
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={reduce ? false : { rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
        >
          {isDark ? (
            <Moon className="h-4 w-4" aria-hidden />
          ) : (
            <Sun className="h-4 w-4" aria-hidden />
          )}
        </motion.span>
      </motion.span>
    </button>
  );
}
