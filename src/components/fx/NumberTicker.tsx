"use client";

import { useEffect, useRef } from "react";
import { m, useInView, useSpring, useTransform } from "framer-motion";
import { cx } from "@/lib/cx";
import { formatAriary, formatNumberFr } from "@/lib/format/ariary";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";

const SPRING = { stiffness: 60, damping: 22 };

type NumberTickerProps = {
  value: number;
  /** « ar » : prix en ariary (« 1 600 000 Ar ») ; « none » : nombre nu fr-FR. */
  unit?: "ar" | "none";
  className?: string;
};

/**
 * Compteur vers la valeur à l'entrée dans le viewport (Famille C, focal, once).
 * Motion value → zéro re-render React par frame. tabular-nums obligatoire.
 */
export function NumberTicker({ value, unit = "none", className }: NumberTickerProps) {
  const format = unit === "ar" ? formatAriary : formatNumberFr;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotionPref();
  const spring = useSpring(0, SPRING);
  const text = useTransform(spring, (v) => format(Math.round(v)));

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, spring, value]);

  if (reduce) {
    return <span className={cx("tabular", className)}>{format(value)}</span>;
  }

  // Lecteurs d'écran : valeur finale stable ; le compteur animé est décoratif.
  return (
    <span ref={ref} className={cx("tabular", className)}>
      <span className="sr-only">{format(value)}</span>
      <m.span aria-hidden="true">{text}</m.span>
    </span>
  );
}
