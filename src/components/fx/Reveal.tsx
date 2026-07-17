"use client";

import { m } from "framer-motion";
import { fadeReduced, fadeUp, staggerChildren } from "@/lib/motion/variants";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";

/* Marge négative UNIQUEMENT en bas (l'élément doit être entré de 80 px) :
   la forme "-80px" seule rétrécissait la fenêtre d'observation sur les
   4 côtés et pouvait rater des déclenchements (section restée invisible). */
const VIEWPORT = { once: true, margin: "0px 0px -80px 0px" } as const;

type RevealProps = {
  className?: string;
  children: React.ReactNode;
};

/** Apparition au scroll : fade + translateY(24px), once (Famille C). */
export function Reveal({ className, children }: RevealProps) {
  const reduce = useReducedMotionPref();
  return (
    <m.div
      className={className}
      variants={reduce ? fadeReduced : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </m.div>
  );
}

/** Parent de stagger (60-90 ms entre cards) : contient des RevealItem. */
export function RevealGroup({ className, children }: RevealProps) {
  return (
    <m.div
      className={className}
      variants={staggerChildren}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </m.div>
  );
}

/** Enfant d'un RevealGroup : hérite du déclenchement du parent. */
export function RevealItem({ className, children }: RevealProps) {
  const reduce = useReducedMotionPref();
  return (
    <m.div className={className} variants={reduce ? fadeReduced : fadeUp}>
      {children}
    </m.div>
  );
}
