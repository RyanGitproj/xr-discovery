"use client";

import { useEffect, useRef } from "react";
import { m, useSpring } from "framer-motion";
import { cx } from "@/lib/cx";
import { usePointerFine } from "@/lib/motion/usePointerFine";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";

const MAX_DEG = 6;
const SPRING = { stiffness: 180, damping: 20, mass: 0.8 };

type TiltCardProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * Inclinaison 3D subtile sous le curseur + reflet qui glisse (Famille B).
 * rotateX/rotateY max 6°, perspective 1000px, retour en ressort.
 * Jamais combinée à GlowReactive sur le même élément.
 */
export function TiltCard({ className, children }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const fine = usePointerFine();
  const reduce = useReducedMotionPref();
  const active = fine && !reduce;

  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  function onMove(event: React.PointerEvent) {
    if (event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = event;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      const py = (clientY - rect.top) / rect.height - 0.5;
      rotateY.set(Math.max(-MAX_DEG, Math.min(MAX_DEG, px * MAX_DEG * 2)));
      rotateX.set(Math.max(-MAX_DEG, Math.min(MAX_DEG, -py * MAX_DEG * 2)));
      el.style.setProperty("--mx", `${clientX - rect.left}px`);
      el.style.setProperty("--my", `${clientY - rect.top}px`);
      el.style.setProperty("--sheen-o", "1");
    });
  }

  function onLeave() {
    cancelAnimationFrame(raf.current);
    rotateX.set(0);
    rotateY.set(0);
    ref.current?.style.setProperty("--sheen-o", "0");
  }

  if (!active) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      ref={ref}
      className={cx("tilt-root", className)}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
      <span aria-hidden="true" className="tilt-sheen" />
    </m.div>
  );
}
