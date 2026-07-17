"use client";

import { useEffect } from "react";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePointerFine } from "@/lib/motion/usePointerFine";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";

const SIZE = 360;
const FOLLOW_SPRING = { stiffness: 150, damping: 22, mass: 0.6 };
const FADE_SPRING = { stiffness: 220, damping: 30 };

/**
 * Halo doux qui suit le curseur sur toute la page, avec retard élastique
 * (Famille B). Un seul, monté dans le layout. Se masque dans les zones
 * Spotlight ([data-spotlight-zone]) pour ne jamais avoir deux halos.
 */
export function GlowCursor() {
  const fine = usePointerFine();
  const reduce = useReducedMotionPref();
  const active = fine && !reduce;

  const rawX = useMotionValue(-SIZE);
  const rawY = useMotionValue(-SIZE);
  const x = useSpring(rawX, FOLLOW_SPRING);
  const y = useSpring(rawY, FOLLOW_SPRING);
  const offsetX = useTransform(x, (v) => v - SIZE / 2);
  const offsetY = useTransform(y, (v) => v - SIZE / 2);
  const opacity = useSpring(0, FADE_SPRING);

  useEffect(() => {
    if (!active) return;
    function onMove(event: PointerEvent) {
      rawX.set(event.clientX);
      rawY.set(event.clientY);
      const masked =
        event.target instanceof Element && event.target.closest("[data-spotlight-zone]") !== null;
      opacity.set(masked ? 0 : 1);
    }
    function onLeave() {
      opacity.set(0);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [active, rawX, rawY, opacity]);

  if (!active) return null;

  return (
    <m.div
      aria-hidden="true"
      className="glow-cursor"
      style={{ x: offsetX, y: offsetY, opacity }}
    />
  );
}
