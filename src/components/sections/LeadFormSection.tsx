import { GlassPanel } from "@/components/fx/GlassPanel";
import { Reveal } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LeadForm } from "@/components/forms/LeadForm";
import styles from "./LeadFormSection.module.css";

/**
 * Section 10 du blueprint : formulaire de qualification multi-étapes,
 * calqué sur la fiche d'appel, dans un GlassPanel. Focus ring en --accent.
 */
export function LeadFormSection() {
  return (
    <section id="devis" className={`fx-section ${styles.section}`}>
      <div className={styles.container}>
        <SectionHeading
          kicker="Votre devis"
          title="Parlez-nous de votre projet"
          subtitle="4 étapes, 2 minutes — ou continuez directement sur WhatsApp."
        />
        <Reveal className={styles.formWrap}>
          <GlassPanel className={styles.panel}>
            <LeadForm />
          </GlassPanel>
        </Reveal>
      </div>
    </section>
  );
}
