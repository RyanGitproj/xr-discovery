"use client";

import { GlassPanel } from "@/components/fx/GlassPanel";
import { NeuralField } from "@/components/fx/NeuralField";
import { Reveal } from "@/components/fx/Reveal";
import { StickyScrollReveal } from "@/components/fx/StickyScrollReveal";
import { TracingBeam } from "@/components/fx/TracingBeam";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx } from "@/lib/cx";
import { useMinWidth } from "@/lib/motion/useMinWidth";
import { deploymentSection } from "@/config/content";
import styles from "./DeploymentSection.module.css";

/** Breakpoint du bascule Sticky/TracingBeam — DOIT suivre le module CSS. */
const DESKTOP_MIN_WIDTH = 1024;

const STEPS = deploymentSection.steps.map(({ title, body }) => ({ title, body }));

/** Un hue par étape — le visuel épinglé change de couleur en avançant. */
const STEP_HUES = [styles.hueCyan, styles.hueHot, styles.hueViolet, styles.huePink, styles.hueCyan];

/**
 * Section 8 du blueprint : le déploiement en 5 étapes. Desktop :
 * StickyScrollReveal (visuel épinglé, étapes qui s'activent). Mobile :
 * TracingBeam vertical simple. FOCAL : la tête lumineuse du faisceau.
 * Les deux variantes ne cohabitent que le temps de l'hydratation (SSR :
 * le CSS masque l'inutile) — ensuite une seule reste montée, son double
 * suivi de scroll était le 1er foyer de frames longues du perf-check.
 */
export function DeploymentSection() {
  const isDesktop = useMinWidth(DESKTOP_MIN_WIDTH);

  return (
    // PAS de fx-section ni d'overflow-hidden ici : contain/overflow sur un
    // ancêtre casse le position:sticky du StickyScrollReveal.
    <section id="deploiement" data-mood="teal" className={styles.section}>
      <div className={styles.heading}>
        <SectionHeading kicker={deploymentSection.kicker} title={deploymentSection.title} />
      </div>

      {isDesktop !== false && (
        <div className={styles.desktop}>
          <StickyScrollReveal steps={STEPS} visual={(active) => <StepVisual active={active} />} />
        </div>
      )}

      {isDesktop !== true && (
        <div className={styles.mobile}>
          <TracingBeam steps={STEPS} />
        </div>
      )}
    </section>
  );
}

/**
 * Panneau et NeuralField PERSISTANTS entre les étapes : seul le bloc
 * icône/titre est remonté (Reveal key). L'ancien remount intégral recréait
 * tout le champ de neurones à chaque étape — 1er foyer de frames longues
 * mesuré au motion-perf-check.
 */
function StepVisual({ active }: { active: number }) {
  const step = deploymentSection.steps[active];
  const Icon = step.icon;
  return (
    <GlassPanel className={styles.panel}>
      <NeuralField className={styles.neural} />
      <Reveal key={active}>
        <div className={styles.stepContent}>
          <Icon aria-hidden="true" className={cx(styles.stepIcon, STEP_HUES[active])} />
          <p className={styles.stepTitle}>{step.title}</p>
          <p className={styles.stepCount}>
            {active + 1} / {deploymentSection.steps.length}
          </p>
        </div>
      </Reveal>
    </GlassPanel>
  );
}
