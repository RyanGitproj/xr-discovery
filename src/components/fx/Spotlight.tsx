"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/lib/cx";
import { usePointerFine } from "@/lib/motion/usePointerFine";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";

type SpotlightProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * Halo radial qui suit le curseur dans une zone délimitée (Famille B).
 * Variables CSS --mx/--my mises à jour en rAF : un seul listener sur la
 * zone, zéro re-render React. Statique sur tactile et en reduced-motion.
 */
export function Spotlight({ className, children }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const fine = usePointerFine();
  const reduce = useReducedMotionPref();
  const active = fine && !reduce;

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  function onMove(event: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = event;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - rect.left}px`);
      el.style.setProperty("--my", `${clientY - rect.top}px`);
      el.style.setProperty("--spot-o", "1");
    });
  }

  function onLeave() {
    cancelAnimationFrame(raf.current);
    ref.current?.style.setProperty("--spot-o", "0");
  }

  if (!active) {
    return <div className={cx("spotlight-zone", className)}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      data-spotlight-zone=""
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cx("spotlight-zone", className)}
    >
      {children}
    </div>
  );
}
