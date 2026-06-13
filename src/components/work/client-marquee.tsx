"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { DbVenue } from "@/lib/site-store";

export function ClientMarquee({ venues }: { venues: DbVenue[] }) {
  const reduce = useReducedMotion();
  const names = venues.map((v) => v.name);
  const row = [...names, ...names];

  if (reduce) {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {names.map((name) => (
          <li
            key={name}
            className="font-display text-lg font-semibold text-muted-foreground"
          >
            {name}
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
        {row.map((name, i) => (
          <li
            key={`${name}-${i}`}
            className="font-display text-xl font-semibold text-muted-foreground/80 transition-colors hover:text-gold"
          >
            {name}
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
