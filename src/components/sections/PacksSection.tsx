import { Check } from "lucide-react";
import { DecryptNumber } from "@/components/fx/DecryptNumber";
import { GeoFrame } from "@/components/fx/GeoFrame";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { LampHeader } from "@/components/fx/LampHeader";
import { Reveal, RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { TiltCard } from "@/components/fx/TiltCard";
import { Figure } from "@/components/ui/Figure";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { Pill } from "@/components/ui/Pill";
import { cx } from "@/lib/cx";
import { packsSection, type Pack } from "@/config/content";
import { packImages } from "@/config/images";
import styles from "./PacksSection.module.css";

/**
 * Section 5 du blueprint : titre en Lamp Effect, 3 GlassPanel en TiltCard,
 * pack central surélevé + BeamBorder permanent + glow-strong, prix en
 * DecryptNumber (révélation déchiffrement — un compteur croissant ferait
 * « grimper » le prix). FOCAL : le pack central. « à partir de » partout.
 */
export function PacksSection() {
  return (
    <section id="packs" className={`fx-section ${styles.section}`}>
      <div className={styles.container}>
        <Reveal>
          <LampHeader>
            <p className={styles.kicker}>{packsSection.kicker}</p>
            <h2 className={styles.title}>{packsSection.title}</h2>
            <p className={styles.subtitle}>{packsSection.subtitle}</p>
          </LampHeader>
        </Reveal>

        <RevealGroup className={styles.grid}>
          {packsSection.packs.map((pack) => (
            <RevealItem key={pack.id} className={cx(pack.featured === true && styles.itemFeatured)}>
              <PackCard pack={pack} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function PackCard({ pack }: { pack: Pack }) {
  const image = packImages[pack.id];
  const panel = (
    <GlassPanel className={cx(styles.panel, pack.featured === true && styles.panelFeatured)}>
      {image !== undefined && (
        <Figure
          image={image}
          parallax={-0.18}
          sizes="(max-width: 1024px) 100vw, 384px"
          className={styles.figure}
        />
      )}
      <h3 className={styles.packName}>{pack.name}</h3>
      <p className={styles.tagline}>{pack.tagline}</p>
      <p className={styles.priceBlock}>
        <span className={styles.pricePrefix}>{packsSection.pricePrefix}</span>
        <span
          className={cx(styles.price, pack.featured === true ? "holo-text" : styles.priceRegular)}
        >
          <DecryptNumber value={pack.price} unit="ar" />
        </span>
      </p>
      <ul className={styles.features}>
        {pack.features.map((feature) => (
          <li key={feature} className={styles.feature}>
            <Check aria-hidden="true" className={styles.check} />
            {feature}
          </li>
        ))}
      </ul>
      <OutlineButton scrollTo="devis" className={styles.cta}>
        {packsSection.cta}
      </OutlineButton>
    </GlassPanel>
  );

  return (
    <TiltCard className={styles.tilt}>
      <GeoFrame
        variant="frame"
        shape="hud"
        chamfer={pack.featured === true ? 22 : 14}
        trace={pack.featured === true}
        className={styles.geo}
      >
        {panel}
      </GeoFrame>
      {/* Hors du GeoFrame : à cheval sur le bord, il serait rogné par le clip. */}
      {pack.badge !== undefined && <Pill className={styles.badge}>{pack.badge}</Pill>}
    </TiltCard>
  );
}
