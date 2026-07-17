"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { cx } from "@/lib/cx";
import { usePointerFine } from "@/lib/motion/usePointerFine";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";
import {
  FLOW_RANGE_DEFAULT,
  INSET_RANGE_DEFAULT,
  flowKeyframes,
  insetKeyframes,
  insetScale,
} from "@/lib/motion/parallaxMath";
import { useParallaxScene } from "./ParallaxScene";
import styles from "./ParallaxScene.module.css";

type ParallaxLayerProps = {
  /** Profondeur [-1, 1] : négatif = fond qui traîne, 0 = plan du contenu,
      positif = avant-plan qui devance. */
  depth: number;
  /** "flow" (défaut) : translation px dans le flux. "inset" : glissement en %
      + sur-échelle auto dans un cadre overflow:hidden (image de Figure) —
      les bords ne se découvrent jamais. */
  mode?: "flow" | "inset";
  /** Amplitude px à |depth| = 1 en mode flow (clampée [24, 160]). */
  range?: number;
  /** Amplitude de remplacement sur pointeur grossier (tactile) : un layout
      mobile empilé supporte moins de débattement. Défaut : `range`. */
  touchRange?: number;
  /** Amplitude % à |depth| = 1 en mode inset (clampée [4, 10]). */
  insetRange?: number;
  className?: string;
  children: React.ReactNode;
};

/**
 * Le SEUL traducteur profondeur → transform du système parallax (Immersion
 * v2.1). Wrapper m.div dédié : ne jamais le fusionner avec un élément qui
 * anime déjà son transform (TiltCard, EnterRise) — les emboîter dedans.
 * Dans une ParallaxScene : consomme la progression partagée ; hors scène :
 * mesure sa propre traversée du viewport (standalone). Jamais d'opacité —
 * le contenu reste intégralement visible sans JS et sous reduced-motion.
 */
export function ParallaxLayer({
  depth,
  mode = "flow",
  range = FLOW_RANGE_DEFAULT,
  touchRange,
  insetRange = INSET_RANGE_DEFAULT,
  className,
  children,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const scene = useParallaxScene();
  const reduce = useReducedMotionPref();
  const fine = usePointerFine();
  const own = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = scene?.progress ?? own.scrollYProgress;
  const neutral = scene?.neutral ?? 0.5;
  const effectiveRange = fine ? range : (touchRange ?? range);

  const [flowFrom, flowTo] = flowKeyframes(depth, effectiveRange, neutral);
  const [insetFrom, insetTo] = insetKeyframes(depth, insetRange, neutral);
  const flowY = useTransform(progress, [0, 1], [flowFrom, flowTo]);
  const insetY = useTransform(progress, [0, 1], [`${insetFrom}%`, `${insetTo}%`]);
  const y = mode === "flow" ? flowY : insetY;

  // Inset coupé sur tactile (même logique que la Famille B, règle Motion) :
  // le micro-glissement d'image ne se perçoit pas au pouce et son coût
  // composité pèse sur le budget mobile — l'immersion tactile passe par la
  // plongée et le gyroscope. Le mode flow garde touchRange pour se doser.
  if (reduce || (mode === "inset" && !fine)) {
    return (
      <div ref={ref} className={cx(mode === "inset" && styles.inset, className)}>
        {children}
      </div>
    );
  }

  if (mode === "inset") {
    return (
      <m.div
        ref={ref}
        className={cx(styles.inset, className)}
        style={{ y, scale: insetScale(depth, insetRange) }}
      >
        {children}
      </m.div>
    );
  }

  return (
    <m.div ref={ref} className={cx(styles.layer, className)} style={{ y }}>
      {children}
    </m.div>
  );
}
