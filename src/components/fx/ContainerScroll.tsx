"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { cx } from "@/lib/cx";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";

type ContainerScrollProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * Le visuel se redresse en entrant dans le viewport : rotateX 12° → 0,
 * scale 0.96 → 1 (Famille C, « écran qui se déploie »). Pour du parallaxe
 * multi-couches (autorisé depuis Immersion v2.1), voir ParallaxScene/Layer.
 */
export function ContainerScroll({ className, children }: ContainerScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionPref();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.3"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [12, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cx("fx-perspective", className)}>
      <m.div style={{ rotateX, scale }} className="will-change-transform">
        {children}
      </m.div>
    </div>
  );
}
