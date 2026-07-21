import { Reveal, RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { TextScrollReveal } from "@/components/fx/TextScrollReveal";
import { Figure } from "@/components/ui/Figure";
import { Pill } from "@/components/ui/Pill";
import { argumentSection } from "@/config/content";
import { argumentImage } from "@/config/images";
import styles from "./ArgumentSection.module.css";

/**
 * Section 6 du blueprint : l'argumentaire commercial en TextScrollReveal
 * (chaque mot s'allume au fil du scroll, unique occurrence de la page),
 * guillemets géants en accent 10 %, options en pills glass, visuel signature.
 */
export function ArgumentSection() {
  return (
    <section className={`fx-section ${styles.section}`}>
      <div className={styles.container}>
        <span aria-hidden="true" className={styles.quoteMark}>
          «
        </span>
        <p className={styles.kicker}>{argumentSection.kicker}</p>
        <TextScrollReveal className={styles.quote} text={argumentSection.quote} />

        <RevealGroup className={styles.optionsGroup}>
          <RevealItem>
            <h3 className={styles.optionsTitle}>{argumentSection.optionsTitle}</h3>
          </RevealItem>
          <div className={styles.pills}>
            {argumentSection.options.map((option) => (
              <RevealItem key={option}>
                <Pill>{option}</Pill>
              </RevealItem>
            ))}
          </div>
        </RevealGroup>

        <Reveal className={styles.figure}>
          <Figure image={argumentImage} parallax={-0.25} sizes="(max-width: 896px) 100vw, 896px" />
        </Reveal>
      </div>
    </section>
  );
}
