"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useScroll, type MotionValue } from "framer-motion";
import { cx } from "@/lib/cx";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";
import type { ParallaxNeutral } from "@/lib/motion/parallaxMath";
import styles from "./ParallaxScene.module.css";

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

type ParallaxSceneContextValue = {
  /** Progression 0-1 de la scène dans sa fenêtre d'observation. */
  progress: MotionValue<number>;
  /** Point d'alignement partagé par tous les calques de la scène. */
  neutral: ParallaxNeutral;
};

const ParallaxSceneContext = createContext<ParallaxSceneContextValue | null>(null);

/** null hors de toute ParallaxScene, auquel cas ParallaxLayer passe en standalone. */
export function useParallaxScene(): ParallaxSceneContextValue | null {
  return useContext(ParallaxSceneContext);
}

type ParallaxSceneProps = {
  /** Fenêtre d'observation framer-motion. Défaut : toute la traversée du
      viewport. Hero épinglé en haut : ["start start", "end start"]. */
  offset?: ScrollOffset;
  /** Voir ParallaxNeutral : 0.5 (défaut) ou 0 pour une scène en place au
      chargement. */
  neutral?: ParallaxNeutral;
  className?: string;
  children: React.ReactNode;
};

const DEFAULT_OFFSET: ScrollOffset = ["start end", "end start"];

/**
 * Contexte de profondeur (Immersion v2.1) : mesure UNE fois la progression de
 * la scène dans le viewport et la partage aux ParallaxLayer enfants. Pose
 * data-active (IntersectionObserver ±160px) pour que le CSS n'arme
 * will-change que près du viewport. Sous prefers-reduced-motion : simple
 * conteneur, aucun contexte, et les calques restent à leur position de design.
 */
export function ParallaxScene({
  offset = DEFAULT_OFFSET,
  neutral = 0.5,
  className,
  children,
}: ParallaxSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionPref();
  const [active, setActive] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset });

  useEffect(() => {
    const el = ref.current;
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

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cx(styles.scene, className)}
      data-active={active ? "true" : undefined}
    >
      <ParallaxSceneContext.Provider value={{ progress: scrollYProgress, neutral }}>
        {children}
      </ParallaxSceneContext.Provider>
    </div>
  );
}
