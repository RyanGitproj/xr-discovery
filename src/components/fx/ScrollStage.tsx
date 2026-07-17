"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useScroll, type MotionValue } from "framer-motion";
import { cx } from "@/lib/cx";
import { clamp } from "@/lib/motion/parallaxMath";
import { useDeviceTilt, type DeviceTiltStatus } from "@/lib/motion/useDeviceTilt";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";
import styles from "./ScrollStage.module.css";

const SCREENS_DEFAULT = 3;
const SCREENS_MIN = 2;
const SCREENS_MAX = 4;

type ScrollStageContextValue = {
  /** Progression 0-1 du récit (0 = scène qui s'épingle, 1 = relâchée). */
  progress: MotionValue<number>;
  /** Gyroscope lissé -1..1 (0 tant que non accordé/supporté). */
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  tiltStatus: DeviceTiltStatus;
  /** iOS : à appeler dans un geste utilisateur (pill de permission). */
  requestTiltAccess: () => Promise<void>;
};

const ScrollStageContext = createContext<ScrollStageContextValue | null>(null);

/** null hors de tout ScrollStage — StageLayer reste alors statique. */
export function useScrollStage(): ScrollStageContextValue | null {
  return useContext(ScrollStageContext);
}

type ScrollStageProps = {
  /** Longueur du récit en écrans (hauteur totale = screens × 100svh),
      clampée [2, 4]. */
  screens?: number;
  /** Version statique COMPLÈTE (tout le contenu, hauteur naturelle) rendue
      seule sous prefers-reduced-motion : rien ne manque, rien n'est imposé. */
  fallback: React.ReactNode;
  className?: string;
  /** Classe de l'écran épinglé (fond, composition). */
  stageClassName?: string;
  children: React.ReactNode;
};

/**
 * Scrollytelling épinglé (Immersion v2.1) : wrapper de N écrans, écran sticky
 * qui joue le storyboard des StageLayer enfants au rythme du scroll —
 * bidirectionnel et déterministe par construction (aucun état, remonter
 * rejoue l'état exact), et AUCUN ralentissement de la molette : la scène ne
 * fait que lire la progression. Fournit aussi le gyroscope aux calques
 * (tiltRange) et l'état de permission à la section (pill iOS).
 */
export function ScrollStage({
  screens = SCREENS_DEFAULT,
  fallback,
  className,
  stageClassName,
  children,
}: ScrollStageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionPref();
  const [active, setActive] = useState(false);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });
  const tilt = useDeviceTilt();

  useEffect(() => {
    const el = wrapperRef.current;
    if (reduce || !el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setActive(entry.isIntersecting);
      },
      { rootMargin: "160px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduce]);

  const value = useMemo(
    () => ({
      progress: scrollYProgress,
      tiltX: tilt.x,
      tiltY: tilt.y,
      tiltStatus: tilt.status,
      requestTiltAccess: tilt.requestAccess,
    }),
    [scrollYProgress, tilt.x, tilt.y, tilt.status, tilt.requestAccess],
  );

  if (reduce) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <div
      ref={wrapperRef}
      className={cx(styles.wrapper, className)}
      data-active={active ? "true" : undefined}
      style={{ "--stage-screens": clamp(Math.round(screens), SCREENS_MIN, SCREENS_MAX) } as React.CSSProperties}
    >
      <div className={cx(styles.stage, stageClassName)}>
        <ScrollStageContext.Provider value={value}>{children}</ScrollStageContext.Provider>
      </div>
    </div>
  );
}
