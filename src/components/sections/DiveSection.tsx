"use client";

import Image from "next/image";
import { ScrollStage, useScrollStage } from "@/components/fx/ScrollStage";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { StageLayer } from "@/components/fx/StageLayer";
import { Pill } from "@/components/ui/Pill";
import { cx } from "@/lib/cx";
import { diveSection } from "@/config/content";
import { diveImages } from "@/config/images";
import styles from "./DiveSection.module.css";

/**
 * Storyboard de la plongée (progress 0 → 1 sur 3 écrans épinglés) : le
 * casque approche et les couches s'écartent, zoom dans la visière, le halo
 * devient porte de lumière, l'univers VR se révèle, message final + CTA.
 * Données pures — la mécanique vit dans ScrollStage/StageLayer.
 */
const STORY = {
  universe: { at: [0.45, 0.75, 1], scale: [1.15, 1, 1], opacity: [0, 1, 1], tiltRange: 24 },
  lensGlow: { at: [0.4, 0.55, 0.75], scale: [0.6, 1.8, 3.2], opacity: [0, 0.9, 0] },
  headsetBack: {
    at: [0, 0.45, 0.62],
    y: [88, 24, 0],
    scale: [0.55, 1.15, 2.2],
    opacity: [1, 1, 0],
    tiltRange: 14,
  },
  headsetFront: {
    at: [0, 0.45, 0.68],
    y: [64, 0, 0],
    scale: [0.55, 1.15, 2.6],
    opacity: [1, 1, 0],
    tiltRange: 14,
  },
  particles: { at: [0, 0.45], y: [120, -160], tiltRange: 8 },
  intro: { at: [0, 0.14, 0.32], y: [0, 0, -40], opacity: [1, 1, 0] },
  reveal: { at: [0.74, 0.9], y: [32, 0], opacity: [0, 1] },
} as const;

/** Pill iOS : rendue uniquement tant que la permission gyro est à demander. */
function GyroPill() {
  const stage = useScrollStage();
  if (stage?.tiltStatus !== "prompt") return null;
  return (
    <button
      type="button"
      className={styles.gyroPill}
      onClick={() => void stage.requestTiltAccess()}
    >
      {diveSection.gyroCta}
    </button>
  );
}

function IntroCopy() {
  return (
    <div className={styles.copy}>
      <Pill className={styles.kicker}>{diveSection.kicker}</Pill>
      <h2 className={styles.title}>{diveSection.title}</h2>
      <p className={styles.body}>{diveSection.intro}</p>
    </div>
  );
}

function RevealCopy() {
  return (
    <div className={styles.copy}>
      <p className={styles.revealTitle}>{diveSection.reveal.title}</p>
      <p className={styles.body}>{diveSection.reveal.body}</p>
      <div className={styles.ctaRow}>
        <ShimmerCTA href={diveSection.ctaHref}>{diveSection.cta}</ShimmerCTA>
      </div>
    </div>
  );
}

/** Reduced-motion : toute la scène à plat — rien ne manque, rien n'est imposé. */
function StaticFallback() {
  return (
    <div className={styles.fallback}>
      <IntroCopy />
      <Image
        src={diveImages.headsetFront.src}
        alt=""
        width={diveImages.headsetFront.width}
        height={diveImages.headsetFront.height}
        unoptimized
        className={styles.fallbackImg}
      />
      <RevealCopy />
    </div>
  );
}

/**
 * Scène immersive « plongée Quest 3 » (Immersion v2.1) — l'interaction
 * signature de la page. Le scroll reste natif/Lenis : la scène ne fait que
 * lire la progression (déterministe, bidirectionnelle). Images en lazy
 * (chargement natif du navigateur, marge généreuse de Chrome — placeholders
 * SVG légers en attendant les calques Codex).
 */
export function DiveSection() {
  return (
    <section className={cx("fx-section", styles.section)}>
      <ScrollStage screens={3} fallback={<StaticFallback />} stageClassName={styles.stageBg}>
        <StageLayer {...STORY.universe}>
          <Image
            src={diveImages.universe.src}
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className={styles.imgFull}
          />
        </StageLayer>
        <StageLayer {...STORY.lensGlow}>
          <Image
            src={diveImages.lensGlow.src}
            alt=""
            width={diveImages.lensGlow.width}
            height={diveImages.lensGlow.height}
            unoptimized
            className={styles.imgGlow}
          />
        </StageLayer>
        <StageLayer {...STORY.headsetBack}>
          <Image
            src={diveImages.headsetBack.src}
            alt=""
            width={diveImages.headsetBack.width}
            height={diveImages.headsetBack.height}
            unoptimized
            className={styles.imgHeadset}
          />
        </StageLayer>
        <StageLayer {...STORY.headsetFront}>
          <Image
            src={diveImages.headsetFront.src}
            alt=""
            width={diveImages.headsetFront.width}
            height={diveImages.headsetFront.height}
            unoptimized
            className={styles.imgHeadset}
          />
        </StageLayer>
        <StageLayer {...STORY.particles}>
          <Image
            src={diveImages.particles.src}
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className={styles.imgFull}
          />
        </StageLayer>
        <StageLayer {...STORY.intro} decorative={false} className={styles.layerTop}>
          <IntroCopy />
        </StageLayer>
        <StageLayer {...STORY.reveal} decorative={false}>
          <RevealCopy />
        </StageLayer>
        <GyroPill />
      </ScrollStage>
    </section>
  );
}
