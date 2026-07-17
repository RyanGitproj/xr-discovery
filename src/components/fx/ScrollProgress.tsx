"use client";

import { m, useScroll, useSpring } from "framer-motion";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";

/**
 * Filet lumineux 2px de progression de lecture (Famille C).
 * Monté une seule fois, au bord inférieur de la navbar. Sous reduced-motion,
 * la barre reste (info de lecture pilotée par le geste), sans ressort.
 */
export function ScrollProgress() {
  const reduce = useReducedMotionPref();
  const { scrollYProgress } = useScroll();
  const smoothed = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  return (
    <m.div
      aria-hidden="true"
      className="scroll-progress"
      style={{ scaleX: reduce ? scrollYProgress : smoothed }}
    />
  );
}
