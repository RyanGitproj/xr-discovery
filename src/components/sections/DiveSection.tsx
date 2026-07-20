"use client";

import Image from "next/image";
import { Embers } from "@/components/fx/Embers";
import { HeadsetSceneLazy } from "@/components/fx/HeadsetSceneLazy";
import { ScrollStage, useScrollStage } from "@/components/fx/ScrollStage";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { StageLayer } from "@/components/fx/StageLayer";
import { Pill } from "@/components/ui/Pill";
import { cx } from "@/lib/cx";
import { usePointerFine } from "@/lib/motion/usePointerFine";
import { diveSection } from "@/config/content";
import { diveImages } from "@/config/images";
import styles from "./DiveSection.module.css";

/**
 * Storyboard de la plongée (progress 0 → 1 sur 3 écrans épinglés). Le casque
 * est une VRAIE scène 3D (react-three-fiber, `HeadsetSceneLazy`) : il approche,
 * pivote et présente ses lentilles qui engloutissent l'écran (mise du casque) ;
 * un voile + un embrasement PLEIN ÉCRAN prennent le relais et fondent vers
 * l'univers VR. Données pures — la mécanique 2D vit dans StageLayer, la 3D
 * dans HeadsetScene.
 */
const STORY = {
  /* Mascotte officielle en filigrane derrière le casque 3D (~35 %, décision
     Ryan 18/07) — fondue AVANT le voile de mise du casque. */
  mascotte: { at: [0, 0.5, 0.62], opacity: [0.35, 0.35, 0], tiltRange: 6 },
  /* Braises d'avant-plan : le calque translate au scroll pendant que chaque
     braise monte en propre (double mouvement) ; s'efface à la mise du casque. */
  embersFront: { at: [0, 0.45, 0.58], y: [80, -60, -140], opacity: [1, 1, 0], tiltRange: 8 },
  headset: { at: [0, 0.62, 0.72], opacity: [1, 1, 0] },
  veil: { at: [0.5, 0.6, 0.68], opacity: [0, 0.92, 0] },
  bloom: { at: [0.56, 0.68, 0.82], scale: [0.7, 1.25, 1.5], opacity: [0, 1, 0] },
  universe: { at: [0.6, 0.82, 1], scale: [1.12, 1, 1], opacity: [0, 1, 1], tiltRange: 24 },
  /* Braises de l'univers révélé : montent dans la nébuleuse. */
  embersUniverse: { at: [0.68, 0.85, 1], opacity: [0, 0.8, 0.8], tiltRange: 10 },
  intro: { at: [0, 0.14, 0.32], y: [0, 0, -40], opacity: [1, 1, 0] },
  reveal: { at: [0.78, 0.92], y: [32, 0], opacity: [0, 1] },
} as const;

/** Scène 3D branchée sur la progression + le gyro du ScrollStage. */
function HeadsetLayer() {
  const stage = useScrollStage();
  const fine = usePointerFine();
  if (!stage) return null;
  return (
    <HeadsetSceneLazy
      progress={stage.progress}
      tiltX={stage.tiltX}
      tiltY={stage.tiltY}
      dpr={fine ? 1.5 : 1}
    />
  );
}

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
        <ShimmerCTA scrollTo={diveSection.ctaScrollTo}>{diveSection.cta}</ShimmerCTA>
      </div>
    </div>
  );
}

/** Reduced-motion : toute la scène à plat (image 2D) — rien n'est imposé. */
function StaticFallback() {
  return (
    <div className={styles.fallback}>
      <IntroCopy />
      <div className={styles.fallbackVisual}>
        <Image
          src={diveImages.mascotte.src}
          alt=""
          width={diveImages.mascotte.width}
          height={diveImages.mascotte.height}
          unoptimized
          className={styles.fallbackMascotte}
        />
        <Image
          src={diveImages.headsetFront.src}
          alt=""
          width={diveImages.headsetFront.width}
          height={diveImages.headsetFront.height}
          unoptimized
          className={styles.fallbackImg}
        />
      </div>
      <RevealCopy />
    </div>
  );
}

/**
 * Scène immersive « plongée Quest 3 » (Immersion v2.1) — l'interaction
 * signature de la page. Le scroll reste natif/Lenis : la scène ne fait que
 * lire la progression (déterministe, bidirectionnelle). Le casque 3D est
 * lazy-monté près du viewport (chunk three.js hors first-view).
 */
export function DiveSection() {
  return (
    <section className={cx("fx-section", styles.section)}>
      <ScrollStage screens={3} fallback={<StaticFallback />} stageClassName={styles.stageBg}>
        {/* Mascotte en filigrane — tout au fond, derrière le casque 3D */}
        <StageLayer {...STORY.mascotte} className={styles.mascotteLayer}>
          <Image
            src={diveImages.mascotte.src}
            alt=""
            width={diveImages.mascotte.width}
            height={diveImages.mascotte.height}
            unoptimized
            className={styles.mascotte}
          />
        </StageLayer>

        {/* Univers révélé (fond de la fin) — bas fondu, jamais de coupure */}
        <StageLayer {...STORY.universe} className={styles.universeLayer}>
          <Image
            src={diveImages.universe.src}
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className={styles.imgFull}
          />
        </StageLayer>

        {/* Braises montant dans l'univers révélé */}
        <StageLayer {...STORY.embersUniverse}>
          <Embers count={20} />
        </StageLayer>

        {/* Casque 3D — s'estompe une fois l'écran englouti */}
        <StageLayer {...STORY.headset}>
          <HeadsetLayer />
        </StageLayer>

        {/* Braises d'avant-plan (chassées pendant l'approche) — assez
            présentes pour inviter au scroll, sans voler la scène 3D */}
        <StageLayer {...STORY.embersFront}>
          <Embers count={34} />
        </StageLayer>

        {/* Transition plein écran : voile sombre puis embrasement */}
        <StageLayer {...STORY.veil}>
          <div className={styles.veil} />
        </StageLayer>
        <StageLayer {...STORY.bloom}>
          <div className={styles.bloom} />
        </StageLayer>

        {/* Textes (vrais nœuds DOM, toujours présents) */}
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
