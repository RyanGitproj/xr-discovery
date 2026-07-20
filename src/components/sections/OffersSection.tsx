import { LampHeader } from "@/components/fx/LampHeader";
import { Reveal } from "@/components/fx/Reveal";
import { OfferExplorer } from "@/components/sections/OfferExplorer";
import { offersSection } from "@/config/content";
import styles from "./OffersSection.module.css";

/**
 * Section Offres : titre en Lamp Effect puis sélecteur des 8 secteurs qui
 * pilote les 3 packs affichés (OfferExplorer, interaction signature).
 * Remplace les anciennes sections Audience (4 profils retail) et Packs.
 */
export function OffersSection() {
  return (
    <section id="offres" className={`fx-section ${styles.section}`}>
      <div className={styles.container}>
        <Reveal>
          <LampHeader>
            <p className={styles.kicker}>{offersSection.kicker}</p>
            <h2 className={styles.title}>{offersSection.title}</h2>
            <p className={styles.subtitle}>{offersSection.subtitle}</p>
          </LampHeader>
        </Reveal>

        <Reveal>
          <OfferExplorer />
        </Reveal>
      </div>
    </section>
  );
}
