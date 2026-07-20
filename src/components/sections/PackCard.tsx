import { Check } from "lucide-react";
import { DecryptNumber } from "@/components/fx/DecryptNumber";
import { GeoFrame } from "@/components/fx/GeoFrame";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { TiltCard } from "@/components/fx/TiltCard";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { Pill } from "@/components/ui/Pill";
import { cx } from "@/lib/cx";
import type { OfferPack } from "@/config/offers";
import styles from "./PackCard.module.css";

type PackCardProps = {
  pack: OfferPack;
  pricePrefix: string;
  cta: string;
  /** Effet de bord du CTA (sélection secteur + pack, tracking) — le scroll
      vers le formulaire est porté par le bouton lui-même. */
  onChoose: () => void;
};

/**
 * Card de pack : GlassPanel en TiltCard sous GeoFrame, pack vedette avec
 * chamfer élargi + trace + glow, prix en DecryptNumber (révélation
 * déchiffrement — un compteur croissant ferait « grimper » le prix).
 */
export function PackCard({ pack, pricePrefix, cta, onChoose }: PackCardProps) {
  const featured = pack.featured === true;
  return (
    <TiltCard className={styles.tilt}>
      <GeoFrame
        variant="frame"
        shape="hud"
        chamfer={featured ? 22 : 14}
        trace={featured}
        className={styles.geo}
      >
        <GlassPanel className={cx(styles.panel, featured && styles.panelFeatured)}>
          <h3 className={styles.packName}>{pack.name}</h3>
          <p className={styles.tagline}>{pack.tagline}</p>
          <p className={styles.priceBlock}>
            <span className={styles.pricePrefix}>{pricePrefix}</span>
            <span className={cx(styles.price, featured ? styles.priceFeatured : styles.priceRegular)}>
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
          <OutlineButton scrollTo="devis" onClick={onChoose} className={styles.cta}>
            {cta}
          </OutlineButton>
        </GlassPanel>
      </GeoFrame>
      {/* Hors du GeoFrame : à cheval sur le bord, il serait rogné par le clip. */}
      {pack.badge !== undefined && <Pill className={styles.badge}>{pack.badge}</Pill>}
    </TiltCard>
  );
}
