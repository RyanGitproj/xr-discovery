"use client";

import { useRef } from "react";
import {
  m,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { cx } from "@/lib/cx";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";
import styles from "./VelocityMarquee.module.css";

const COPIES = 4;

type VelocityMarqueeProps = {
  /** Vitesse de base en % de la bande par seconde. */
  baseVelocity?: number;
  className?: string;
  children: React.ReactNode;
};

/**
 * Marquee continu qui accélère subtilement avec la vélocité du scroll
 * (Famille C). Contenu dupliqué pour la boucle, doublons en aria-hidden.
 * Sous reduced-motion : liste statique complète (pas de défilement).
 */
export function VelocityMarquee({ baseVelocity = 2.2, className, children }: VelocityMarqueeProps) {
  const reduce = useReducedMotionPref();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef);
  // WCAG 2.2.2 : le défilement se met en pause au survol / focus.
  const paused = useRef(false);

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2.5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-100 / COPIES, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce || !inView || paused.current) return;
    let moveBy = -baseVelocity * (delta / 1000);
    moveBy *= 1 + Math.abs(velocityFactor.get());
    baseX.set(baseX.get() + moveBy);
  });

  if (reduce) {
    return <div className={cx(styles.static, className)}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={cx(styles.viewport, className)}
      onPointerEnter={() => {
        paused.current = true;
      }}
      onPointerLeave={() => {
        paused.current = false;
      }}
    >
      <m.div className={styles.track} style={{ x }}>
        {Array.from({ length: COPIES }, (_, i) => (
          <div key={i} aria-hidden={i > 0 || undefined} className={styles.copy}>
            {children}
          </div>
        ))}
      </m.div>
    </div>
  );
}

function wrap(min: number, max: number, value: number): number {
  const range = max - min;
  return min + (((value - min) % range) + range) % range;
}
