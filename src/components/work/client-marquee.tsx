"use client";

import { motion, useReducedMotion } from "framer-motion";
import { clients } from "@/lib/content";

/**
 * Infinite, gpu-friendly logo marquee. Duplicates the list and animates the
 * track by -50%. Pauses on hover and collapses to a static wrap when the user
 * prefers reduced motion.
 */
export function ClientMarquee() {
  const reduce = useReducedMotion();
  const row = [...clients, ...clients];

  if (reduce) {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {clients.map((c) => (
          <li
            key={c}
            className="font-display text-lg font-semibold text-muted-foreground"
          >
            {c}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <motion.ul
        className="flex w-max items-center gap-12 pr-12"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        style={{ willChange: "transform" }}
      >
        {row.map((c, i) => (
          <li
            key={`${c}-${i}`}
            className="font-display text-xl font-semibold text-muted-foreground/80 transition-colors hover:text-gold"
          >
            {c}
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
