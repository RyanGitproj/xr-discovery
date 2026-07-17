import { ChevronDown } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { objectionsSection } from "@/config/content";
import styles from "./ObjectionsSection.module.css";

/**
 * Section 7 du blueprint : accordéon sobre — PAS d'effet ici, zone de
 * réassurance (on calme le jeu volontairement). <details> natif : clavier
 * et lecteurs d'écran gratuits, pas de backdrop-filter (budget préservé).
 */
export function ObjectionsSection() {
  return (
    <section id="questions" className={`fx-section ${styles.section}`}>
      <div className={styles.container}>
        <SectionHeading kicker={objectionsSection.kicker} title={objectionsSection.title} />
        <RevealGroup className={styles.list}>
          {objectionsSection.items.map((item) => (
            <RevealItem key={item.question}>
              <details className={styles.item}>
                <summary className={styles.summary}>
                  {item.question}
                  <ChevronDown aria-hidden="true" className={styles.chevron} />
                </summary>
                <p className={styles.answer}>{item.answer}</p>
              </details>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
