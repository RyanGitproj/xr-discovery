import { BackgroundBeams } from "@/components/fx/BackgroundBeams";
import { GeoFrame } from "@/components/fx/GeoFrame";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { Meteors } from "@/components/fx/Meteors";
import { Reveal } from "@/components/fx/Reveal";
import { Sparkles } from "@/components/fx/Sparkles";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { cx } from "@/lib/cx";
import { finalCtaSection } from "@/config/content";
import { casqueVideo } from "@/config/images";
import styles from "./FinalCtaSection.module.css";

/**
 * Vitrine vidéo de clôture : la carte HUD lumineuse (Background Beams +
 * Sparkles + Meteors) encadre la démo casque (portrait, autoplay muet en
 * boucle). Le bouton « devis » a été retiré — le formulaire suit
 * immédiatement (LeadFormSection) ; le titre garde l'accroche.
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
            <AmbientVideo
              video={casqueVideo}
              soundOnLabel={finalCtaSection.soundOnLabel}
              soundOffLabel={finalCtaSection.soundOffLabel}
              className={styles.video}
            />
          </GlassPanel>
        </GeoFrame>
      </Reveal>
    </section>
  );
}
