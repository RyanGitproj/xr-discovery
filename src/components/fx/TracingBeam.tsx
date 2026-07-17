"use client";

import { useEffect, useRef, useState } from "react";
import { m, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { cx } from "@/lib/cx";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";
import styles from "./TracingBeam.module.css";

export type TracingStep = {
  title: string;
  body: string;
};

type TracingBeamProps = {
  steps: readonly TracingStep[];
  className?: string;
};

/**
 * Faisceau vertical dont la progression suit le scroll, point lumineux en
 * tête, étapes qui s'allument à son passage (Famille C). Version mobile de
 * la section Déploiement. Sous reduced-motion : rail statique, tout allumé.
 */
export function TracingBeam({ steps, className }: TracingBeamProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionPref();
  const [height, setHeight] = useState(0);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.55"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const headY = useTransform(progress, (v) => v * height);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setActive(Math.min(steps.length - 1, Math.floor(latest * steps.length + 0.2)));
  });

  const isLit = (index: number) => reduce || index <= active;

  return (
    <div ref={ref} className={cx(styles.root, className)}>
      <div aria-hidden="true" className={styles.rail} />
      {!reduce && (
        <>
          <m.div aria-hidden="true" className={styles.beam} style={{ scaleY: progress }} />
          <m.div aria-hidden="true" className={styles.head} style={{ y: headY }} />
        </>
      )}
      <ol className={styles.list}>
        {steps.map((step, i) => (
          <li key={step.title} className={cx(styles.item, isLit(i) && styles.itemLit)}>
            <span aria-hidden="true" className={cx(styles.dot, isLit(i) && styles.dotLit)} />
            <h3 className={styles.title}>
              <span className={styles.num}>{i + 1}.</span>
              {step.title}
            </h3>
            <p className={styles.body}>{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
