import type { Variants } from "framer-motion";

/** Spring used for structural entrances/exits across the site. */
export const spring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 28,
  mass: 0.9,
};

export const softSpring = {
  type: "spring" as const,
  stiffness: 180,
  damping: 24,
};

/** Parent that staggers its children (~0.06s apart). */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

/** Child rising into place with a spring. */
export const riseItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: spring },
};

export const fadeItem: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};
