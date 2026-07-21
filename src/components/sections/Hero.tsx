import { EnterRise } from "@/components/fx/EnterRise";
import { GridPulse } from "@/components/fx/GridPulse";
import { HoloFigure } from "@/components/fx/HoloFigure";
import { MadagascarField } from "@/components/fx/MadagascarField";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { Meteors } from "@/components/fx/Meteors";
import { ProjectionBeam } from "@/components/fx/ProjectionBeam";
import { RadarPing } from "@/components/fx/RadarPing";
import { NumberTicker } from "@/components/fx/NumberTicker";
import { ParallaxLayer } from "@/components/fx/ParallaxLayer";
import { ParallaxScene } from "@/components/fx/ParallaxScene";
import { Reveal } from "@/components/fx/Reveal";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { Sparkles } from "@/components/fx/Sparkles";
import { Spotlight } from "@/components/fx/Spotlight";
import { TextGenerate } from "@/components/fx/TextGenerate";
import { PROJECTION_TIMELINE } from "@/components/fx/projectionTimeline";
import { Pill } from "@/components/ui/Pill";
import { cx } from "@/lib/cx";
import { hero } from "@/config/content";
import { ANTANANARIVO } from "@/lib/geo/madagascar";
import { toViewPct } from "@/lib/geo/madagascarView";
import styles from "./Hero.module.css";

/** Antananarivo en % du stage, source du faisceau de projection. */
const TANA = toViewPct(ANTANANARIVO);
/** Bord haut du faisceau : remonte dans le buste (bas du buste ≈ 44,6 %) pour
 * que le faisceau suive l'hologramme au lieu de décrocher sous ses pieds. */
const BEAM_TOP = { x: 50, width: 34, y: 36 } as const;

/**
 * Section 1 du blueprint, style v1.2 « Entrez dans une autre réalité » :
 * titre massif solid + outline néon à gauche, casque holographique en scène
 * à droite (orbites, HUD). FOCAL : le CTA ticket (ShimmerCTA +
 * MagneticButton). Le GlowCursor global se masque dans le Spotlight.
 */
export function Hero() {
  return (
    <section className={`fx-section ${styles.section}`}>
      <GridPulse className={styles.gridPulse} />
      <Sparkles count={16} />
      <Meteors count={3} />
      <Spotlight className={styles.spot}>
        {/* neutral 0 : scène déjà en place au chargement (LCP intact), la
            profondeur ne se déploie qu'en quittant le hero. */}
        <ParallaxScene offset={["start start", "end start"]} neutral={0} className={styles.grid}>
          <div>
            <Reveal>
              <Pill className={styles.kickerPill}>{hero.kicker}</Pill>
            </Reveal>
            <h1 className={styles.title}>
              <TextGenerate segments={hero.titleSegments} />
            </h1>
            <Reveal>
              <p className={styles.subtitle}>{hero.subtitle}</p>
            </Reveal>
            <Reveal className={styles.ctas}>
              <div className={styles.ctaRow}>
                <MagneticButton>
                  <ShimmerCTA scrollTo="devis" size="xl">
                    {hero.ctaPrimary}
                  </ShimmerCTA>
                </MagneticButton>
              </div>
            </Reveal>
          </div>

          <HologramStage />
        </ParallaxScene>
      </Spotlight>
    </section>
  );
}

/** Amplitude commune des plans du hero : débattement contenu, la scène
    reste lisible pendant toute la sortie du viewport. */
const STAGE_RANGE = 56;

/**
 * Scène de projection : la constellation Madagascar se forme, le point
 * d'Antananarivo s'allume (RadarPing) et projette le faisceau
 * (ProjectionBeam) qui matérialise le buste hologramme (EnterRise +
 * HoloFigure), au centre d'orbites. Labels HUD (NumberTicker). Timeline :
 * projectionTimeline.ts.
 *
 * Profondeur (Immersion v2.1) : 4 plans parallax ; un plan = un groupe
 * GÉOMÉTRIQUE : constellation + ping + faisceau restent solidaires (l'apex
 * du faisceau EST le point d'Antananarivo), le buste devance, les HUD
 * flottent en avant-plan.
 */
function HologramStage() {
  return (
    <div className={styles.stage}>
      <ParallaxLayer depth={-0.2} range={STAGE_RANGE} className={styles.plane}>
        <div aria-hidden="true" className={styles.orbitOuter} />
        <div aria-hidden="true" className={cx("orbit-spin", styles.orbitInner)} />
      </ParallaxLayer>

      <ParallaxLayer depth={-0.35} range={STAGE_RANGE} className={styles.plane}>
        <MadagascarField className={styles.neural} />
        <ProjectionBeam apex={TANA} top={BEAM_TOP} delay={PROJECTION_TIMELINE.beam} />
        <RadarPing x={TANA.x} y={TANA.y} delay={PROJECTION_TIMELINE.ping} />
      </ParallaxLayer>

      <ParallaxLayer depth={0.3} range={STAGE_RANGE} className={styles.plane}>
        <EnterRise className={styles.hologram} delay={PROJECTION_TIMELINE.headset}>
          <HoloFigure />
        </EnterRise>
      </ParallaxLayer>

      <ParallaxLayer depth={0.55} range={STAGE_RANGE} className={styles.plane}>
        <span aria-hidden="true" className={styles.hudTag}>
          {"// actif"}
        </span>
        <div className={styles.hudTopLeft}>
          <Pill className={styles.hudPill}>
            <NumberTicker value={hero.hud.casques.value} className={styles.hudValueCyan} />
            {hero.hud.casques.label}
          </Pill>
        </div>
        <div className={styles.hudBottomRight}>
          <Pill className={styles.hudPill}>
            <NumberTicker value={hero.hud.univers.value} className={styles.hudValuePink} />
            {hero.hud.univers.label}
          </Pill>
        </div>
      </ParallaxLayer>
    </div>
  );
}
