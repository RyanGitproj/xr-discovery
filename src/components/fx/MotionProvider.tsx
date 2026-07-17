"use client";

import { LazyMotion, domAnimation } from "framer-motion";

/**
 * Charge les features framer-motion à la demande (LazyMotion) : les
 * composants utilisent `m.` au lieu de `motion.` — ~13 ko gzip de moins dans
 * le bundle initial. `strict` fait planter tout `motion.` résiduel en dev,
 * pour que la règle reste tenue. Aucun composant n'utilise drag/layout
 * (domMax inutile).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
