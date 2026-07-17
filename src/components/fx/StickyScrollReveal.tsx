"use client";

import { useRef, useState } from "react";
import { m, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { cx } from "@/lib/cx";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";
import styles from "./StickyScrollReveal.module.css";

export type StickyStep = {
  title: string;
  body: string;
};

type StickyScrollRevealProps = {
  steps: readonly StickyStep[];
  /** Visuel épinglé, rendu selon l'étape active. */
  visual: (activeIndex: number) => React.ReactNode;
  className?: string;
};

/**
 * Section épinglée : le visuel reste fixe pendant que les étapes défilent,
 * reliées par un faisceau vertical à tête lumineuse (FOCAL — blueprint §6.8).
 * Desktop uniquement (le parent rend TracingBeam en mobile). Hauteur totale
 * <= 300vh, index actif au breakpoint le plus proche : bidirectionnel et
 * déterministe. ATTENTION : aucun ancêtre overflow/contain, sinon le sticky
 * ne s'épingle plus. Sous reduced-motion : liste complète, sans pinning.
 */
export function StickyScrollReveal({ steps, visual, className }: StickyScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionPref();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const beamScale = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const headTop = useTransform(beamScale, (v) => `${Math.min(100, Math.max(0, v * 100))}%`);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let closest = 0;
    for (let i = 1; i < steps.length; i += 1) {
      if (Math.abs(latest - i / steps.length) < Math.abs(latest - closest / steps.length)) {
        closest = i;
      }
    }
    setActive(closest);
  });

  if (reduce) {
    return (
      <div className={className}>
        <div className={styles.reducedGrid}>
          <ol className={styles.reducedList}>
            {steps.map((step, i) => (
              <li key={step.title}>
                <StepText step={step} index={i} active />
              </li>
            ))}
          </ol>
          <div>{visual(0)}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ height: `${Math.min(steps.length * 56, 300)}vh` }}
    >
      <div className={styles.pin}>
        <div className={styles.col}>
          <div aria-hidden="true" className={styles.rail} />
          <m.div aria-hidden="true" className={styles.beam} style={{ scaleY: beamScale }} />
          <m.div aria-hidden="true" className={styles.head} style={{ top: headTop }} />
          <ol className={styles.list}>
            {steps.map((step, i) => (
              <li key={step.title} className={cx(styles.item, i === active && styles.itemActive)}>
                <StepText step={step} index={i} active={i === active} />
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.visual}>{visual(active)}</div>
      </div>
    </div>
  );
}

function StepText({ step, index, active }: { step: StickyStep; index: number; active: boolean }) {
  return (
    <>
      <h3 className={styles.title}>
        <span className={cx(styles.num, active && styles.numActive)}>{index + 1}.</span>
        {step.title}
      </h3>
      <p className={styles.body}>{step.body}</p>
    </>
  );
}
