import { BackgroundBeams } from "@/components/fx/BackgroundBeams";
import { GeoFrame } from "@/components/fx/GeoFrame";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { Meteors } from "@/components/fx/Meteors";
import { Reveal } from "@/components/fx/Reveal";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { Sparkles } from "@/components/fx/Sparkles";
import { cx } from "@/lib/cx";
import { finalCtaSection } from "@/config/content";
import styles from "./FinalCtaSection.module.css";

/**
 * Section 9 du blueprint : reprise du bandeau lumineux de l'infographie —
 * Background Beams + GlassPanel géant + ShimmerCTA XXL + MagneticButton
 * (2e et dernière occurrence) + Meteors.
 */
export function FinalCtaSection() {
  return (
    <section className={`fx-section ${styles.section}`}>
      <BackgroundBeams intensity="active" />
      <Sparkles count={10} />
      <Meteors count={2} />
      <Reveal className={styles.wrap}>
        <GeoFrame variant="frame" shape="hud" chamfer={24} trace>
          <GlassPanel className={styles.panel}>
          <h2 className={cx("holo-text holo-text--live", styles.title)}>
            {finalCtaSection.title}
          </h2>
          <p className={styles.subtitle}>{finalCtaSection.subtitle}</p>
          <div className={styles.ctaRow}>
            <MagneticButton>
              <ShimmerCTA scrollTo="devis" size="xl">
                {finalCtaSection.ctaPrimary}
              </ShimmerCTA>
            </MagneticButton>
          </div>
          </GlassPanel>
        </GeoFrame>
      </Reveal>
    </section>
  );
}
