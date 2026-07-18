import { GeoFrame } from "@/components/fx/GeoFrame";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { GlowReactive, GlowReactiveGroup } from "@/components/fx/GlowReactive";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { Figure } from "@/components/ui/Figure";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { audienceSection, type AudienceCard } from "@/config/content";
import { audienceImages, type ImageSlot } from "@/config/images";
import styles from "./AudienceSection.module.css";

/**
 * Section 3 du blueprint : grille ÉDITORIALE (v2) — 12 colonnes inégales,
 * décalages verticaux, radii variés — de GlassPanel (photo en tête),
 * bordures GlowReactive au survol, reveal en stagger. Blocs 1-2 de
 * l'infographie retail (publics + besoin).
 */
export function AudienceSection() {
  const [first, second, third, fourth] = audienceSection.cards;

  return (
    <section id="publics" className={`fx-section ${styles.section}`}>
      <div className={styles.container}>
        <SectionHeading kicker={audienceSection.kicker} title={audienceSection.title} />
        <GlowReactiveGroup>
          <RevealGroup className={styles.grid}>
            <RevealItem className={styles.a1}>
              <Card card={first} image={audienceImages[0]} />
            </RevealItem>
            <RevealItem className={styles.a2}>
              <Card card={second} image={audienceImages[1]} />
            </RevealItem>
            <RevealItem className={styles.aNeed}>
              <GlowReactive className={styles.card}>
                <GeoFrame variant="frame" shape="chamfer" chamfer={26} className={styles.geo}>
                  <GlassPanel className={styles.needPanel}>
                    <p className={styles.kicker}>{audienceSection.need.kicker}</p>
                    <h3 className={styles.needTitle}>{audienceSection.need.title}</h3>
                    <p className={styles.needText}>{audienceSection.need.body}</p>
                  </GlassPanel>
                </GeoFrame>
              </GlowReactive>
            </RevealItem>
            <RevealItem className={styles.a3}>
              <Card card={third} image={audienceImages[2]} />
            </RevealItem>
            <RevealItem className={styles.a4}>
              <Card card={fourth} image={audienceImages[3]} />
            </RevealItem>
          </RevealGroup>
        </GlowReactiveGroup>
      </div>
    </section>
  );
}

function Card({ card, image }: { card: AudienceCard; image?: ImageSlot }) {
  const Icon = card.icon;
  return (
    <GlowReactive className={styles.card}>
      <GeoFrame variant="frame" shape="hud" chamfer={14} className={styles.geo}>
        <GlassPanel className={styles.panel}>
          {image !== undefined && (
            <Figure image={image} flush parallax={-0.12} sizes="(max-width: 768px) 100vw, 384px" />
          )}
          <div className={styles.cardBody}>
            <span className={styles.iconBadge}>
              <Icon aria-hidden="true" className={styles.icon} />
            </span>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <p className={styles.cardText}>{card.body}</p>
          </div>
        </GlassPanel>
      </GeoFrame>
    </GlowReactive>
  );
}
