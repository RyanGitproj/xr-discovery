import { BackgroundBeams } from "@/components/fx/BackgroundBeams";
import { BeamBorder } from "@/components/fx/BeamBorder";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { Meteors } from "@/components/fx/Meteors";
import { Reveal } from "@/components/fx/Reveal";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { Sparkles } from "@/components/fx/Sparkles";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { cx } from "@/lib/cx";
import { finalCtaSection, hero } from "@/config/content";
import { siteConfig } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/format/whatsapp";
import styles from "./FinalCtaSection.module.css";

/**
 * Section 9 du blueprint : reprise du bandeau lumineux de l'infographie —
 * Background Beams + GlassPanel géant + ShimmerCTA XXL + MagneticButton
 * (2e et dernière occurrence) + bouton WhatsApp + Meteors.
 */
export function FinalCtaSection() {
  const whatsappHref = buildWhatsAppLink(siteConfig.whatsappNumber, hero.whatsappIntro);

  return (
    <section className={`fx-section ${styles.section}`}>
      <BackgroundBeams intensity="active" />
      <Sparkles count={10} />
      <Meteors count={2} />
      <Reveal className={styles.wrap}>
        <GlassPanel className={styles.panel}>
          <h2 className={cx("holo-text holo-text--live", styles.title)}>
            {finalCtaSection.title}
          </h2>
          <p className={styles.subtitle}>{finalCtaSection.subtitle}</p>
          <div className={styles.ctaRow}>
            <MagneticButton>
              <BeamBorder className={styles.beam}>
                <ShimmerCTA href="#devis" size="xl">
                  {finalCtaSection.ctaPrimary}
                </ShimmerCTA>
              </BeamBorder>
            </MagneticButton>
            <OutlineButton href={whatsappHref}>{finalCtaSection.ctaWhatsApp}</OutlineButton>
          </div>
        </GlassPanel>
      </Reveal>
    </section>
  );
}
