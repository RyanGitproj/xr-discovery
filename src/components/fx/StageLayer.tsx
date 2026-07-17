"use client";

import { m, motionValue, transform, useTransform } from "framer-motion";
import { cx } from "@/lib/cx";
import { useScrollStage } from "./ScrollStage";
import styles from "./ScrollStage.module.css";

/** Hors ScrollStage (misuse) : le calque reste figé à sa première keyframe. */
const STATIC_PROGRESS = motionValue(0);
const STATIC_TILT = motionValue(0);

type StageLayerProps = {
  /** Points de la timeline sur la progression 0-1, strictement croissants. */
  at: readonly number[];
  /** Pistes alignées sur `at` (même longueur). Absente = constante. */
  y?: readonly number[];
  x?: readonly number[];
  scale?: readonly number[];
  /** Autorisée ici (décor de scène) — jamais sur un contenu porteur seul. */
  opacity?: readonly number[];
  /** Contribution gyroscope en px à ±1 (x plein, y à demi). Défaut 0. */
  tiltRange?: number;
  /** Décoratif (défaut) : aria-hidden, ne capte pas le pointeur. */
  decorative?: boolean;
  className?: string;
  children: React.ReactNode;
};

function assertTracks(at: readonly number[], tracks: Record<string, readonly number[] | undefined>) {
  for (let i = 1; i < at.length; i += 1) {
    if (at[i] <= at[i - 1]) {
      throw new Error(`StageLayer : \`at\` doit être strictement croissant (${at.join(", ")}).`);
    }
  }
  for (const [name, track] of Object.entries(tracks)) {
    if (track && track.length !== at.length) {
      throw new Error(
        `StageLayer : la piste \`${name}\` (${track.length}) doit avoir la longueur de \`at\` (${at.length}).`,
      );
    }
  }
}

/**
 * Calque d'un ScrollStage : timeline déclarative {at → y/x/scale/opacity}
 * mappée sur la progression partagée (useTransform), plus une contribution
 * gyroscope optionnelle. Le storyboard est de la DONNÉE passée par la
 * section — la primitive reste générique (même contrat que
 * StickyScrollReveal(steps)).
 */
export function StageLayer({
  at,
  y,
  x,
  scale,
  opacity,
  tiltRange = 0,
  decorative = true,
  className,
  children,
}: StageLayerProps) {
  const stage = useScrollStage();
  const progress = stage?.progress ?? STATIC_PROGRESS;
  const tiltX = stage?.tiltX ?? STATIC_TILT;
  const tiltY = stage?.tiltY ?? STATIC_TILT;

  assertTracks(at, { y, x, scale, opacity });

  const input = [...at];
  const yBase = useTransform(progress, input, y ? [...y] : input.map(() => 0));
  const xBase = useTransform(progress, input, x ? [...x] : input.map(() => 0));
  const scaleOut = useTransform(progress, input, scale ? [...scale] : input.map(() => 1));
  // Chaîne d'opacité VOLONTAIREMENT impure (forme callback) : une liaison
  // pure progression → opacité est promue par framer en animation native
  // ViewTimeline, qui se fige dans une scène sticky (mesuré au CDP). Le
  // transform, lui, reste en JS grâce à la contribution gyro ci-dessous.
  const opacityTrack = opacity ? [...opacity] : input.map(() => 1);
  const opacityOut = useTransform(() => transform(progress.get(), input, opacityTrack));
  const xOut = useTransform(() => xBase.get() + tiltX.get() * tiltRange);
  const yOut = useTransform(() => yBase.get() + tiltY.get() * (tiltRange / 2));
  // Un calque interactif estompé ne doit pas bloquer les clics des calques
  // du dessous (le CTA final, la pill gyro) : le pointeur suit l'opacité.
  const pointerOut = useTransform(() => (opacityOut.get() > 0.5 ? "auto" : "none"));

  return (
    <m.div
      aria-hidden={decorative || undefined}
      className={cx(styles.layer, !decorative && styles.interactive, className)}
      style={{
        x: xOut,
        y: yOut,
        scale: scale ? scaleOut : undefined,
        opacity: opacity ? opacityOut : undefined,
        pointerEvents: !decorative && opacity ? pointerOut : undefined,
      }}
    >
      {children}
    </m.div>
  );
}
