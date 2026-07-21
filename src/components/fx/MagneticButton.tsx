"use client";

import { useRef } from "react";
import { m, useSpring } from "framer-motion";
import { cx } from "@/lib/cx";
import { usePointerFine } from "@/lib/motion/usePointerFine";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";

const SPRING = { stiffness: 260, damping: 18, mass: 0.6 };
const PULL = 0.25; // fraction de la distance au centre
const MAX = 10; // déplacement max en px

type MagneticButtonProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * Le CTA attire légèrement le curseur puis revient en ressort (Famille B).
 * RÉSERVÉ aux 2 CTA principaux (hero, CTA final) : appliqué partout, l'effet
 * devient nauséeux. Souris uniquement, inerte sur tactile et en reduced-motion.
 */
export function MagneticButton({ className, children }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = usePointerFine();
  const reduce = useReducedMotionPref();
  const active = fine && !reduce;

  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  function onMove(event: React.PointerEvent) {
    if (event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-MAX, Math.min(MAX, dx * PULL)));
    y.set(Math.max(-MAX, Math.min(MAX, dy * PULL)));
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  if (!active) {
    return <div className={cx("inline-flex", className)}>{children}</div>;
  }

  return (
    <m.div
      ref={ref}
      className={cx("inline-flex", className)}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </m.div>
  );
}
