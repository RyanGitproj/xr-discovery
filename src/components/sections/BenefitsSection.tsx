import { GlassPanel } from "@/components/fx/GlassPanel";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { Spotlight } from "@/components/fx/Spotlight";
import { Figure } from "@/components/ui/Figure";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { benefitsSection } from "@/config/content";
import { prestaImage } from "@/config/images";
import styles from "./BenefitsSection.module.css";

/** Placements éditoriaux (lg) : paires miroir 5/7 puis 7/5, radii variés. */
const PLACEMENTS = [styles.b1, styles.b2, styles.b3, styles.b4];

/**
 * Section 4 du blueprint : grille ÉDITORIALE (v2) de cards Spotlight (halo
 * interne suit le curseur) + panneau prestation avec visuel 16:9 coin coupé,
 * liseré --edge-lit.
 */
export function BenefitsSection() {
  return (
    <section className={`fx-section ${styles.section}`}>
      <div className={styles.container}>
        <SectionHeading kicker={benefitsSection.kicker} title={benefitsSection.title} />
        <RevealGroup className={styles.grid}>
          {benefitsSection.cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <RevealItem key={card.title} className={PLACEMENTS[i]}>
                <Spotlight className={styles.spot}>
                  <GlassPanel className={styles.panel}>
                    <span className={styles.iconBadge}>
                      <Icon aria-hidden="true" className={styles.icon} />
                    </span>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardText}>{card.body}</p>
                  </GlassPanel>
                </Spotlight>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <RevealGroup className={styles.prestaGroup}>
          <RevealItem>
            <GlassPanel className={styles.prestaPanel}>
              <div>
                <p className={styles.kicker}>{benefitsSection.presta.kicker}</p>
                <h3 className={styles.prestaTitle}>{benefitsSection.presta.title}</h3>
                <p className={styles.prestaText}>{benefitsSection.presta.body}</p>
              </div>
              <div className={styles.prestaVisual}>
                <Figure
                  image={prestaImage}
                  fill
                  flush
                  parallax={-0.18}
                  sizes="(max-width: 768px) 100vw, 560px"
                />
              </div>
            </GlassPanel>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
