"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Site-wide geometric atmosphere — bold gold/orange shapes with scroll parallax.
 */
export function SiteBackground() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  // Each layer drifts at a different rate while scrolling for depth.
  const slowY = useTransform(scrollY, [0, 4000], [0, -320]);
  const slowX = useTransform(scrollY, [0, 4000], [0, 80]);
  const midY = useTransform(scrollY, [0, 4000], [0, -520]);
  const midX = useTransform(scrollY, [0, 4000], [0, -110]);
  const fastY = useTransform(scrollY, [0, 4000], [0, -520]);
  const fastX = useTransform(scrollY, [0, 4000], [0, 140]);
  const counterY = useTransform(scrollY, [0, 4000], [0, 180]);
  const counterX = useTransform(scrollY, [0, 4000], [0, -70]);

  const staticStyle = undefined;

  return (
    <div
      className="site-background pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="site-background__base" />

      {/* Layer 1 — wide bands, slow drift */}
      <motion.div
        className="site-background__layer"
        style={
          reduce
            ? staticStyle
            : { y: slowY, x: slowX, willChange: "transform" }
        }
      >
        <div className="site-bg-shape site-bg-shape--band site-bg-shape--band-a" />
        <div className="site-bg-shape site-bg-shape--band site-bg-shape--band-b" />
        <div className="site-bg-shape site-bg-shape--band site-bg-shape--band-c" />
      </motion.div>

      {/* Layer 2 — shards & skewed blocks, medium speed */}
      <motion.div
        className="site-background__layer"
        style={
          reduce
            ? staticStyle
            : { y: midY, x: midX, willChange: "transform" }
        }
      >
        <div className="site-bg-shape site-bg-shape--shard site-bg-shape--shard-a" />
        <div className="site-bg-shape site-bg-shape--shard site-bg-shape--shard-b" />
        <div className="site-bg-shape site-bg-shape--skew site-bg-shape--skew-a" />
        <div className="site-bg-shape site-bg-shape--beam site-bg-shape--beam-a" />
      </motion.div>

      {/* Layer 3 — accents, fastest parallax */}
      <motion.div
        className="site-background__layer"
        style={
          reduce
            ? staticStyle
            : { y: fastY, x: fastX, willChange: "transform" }
        }
      >
        <div className="site-bg-shape site-bg-shape--band site-bg-shape--band-d" />
        <div className="site-bg-shape site-bg-shape--chevron site-bg-shape--chevron-a" />
        <div className="site-bg-shape site-bg-shape--chevron site-bg-shape--chevron-b" />
        <div className="site-bg-shape site-bg-shape--glow site-bg-shape--glow-a" />
        <div className="site-bg-shape site-bg-shape--glow site-bg-shape--glow-b" />
      </motion.div>

      {/* Layer 4 — counter-scroll for visual tension */}
      <motion.div
        className="site-background__layer"
        style={
          reduce
            ? staticStyle
            : { y: counterY, x: counterX, willChange: "transform" }
        }
      >
        <div className="site-bg-shape site-bg-shape--band site-bg-shape--band-e" />
        <div className="site-bg-shape site-bg-shape--shard site-bg-shape--shard-c" />
      </motion.div>

      <div className="site-background__mesh" />
      <div className="site-background__vignette" />
      <div className="grain site-background__grain" />
    </div>
  );
}
