import { GlassPanel } from "@/components/fx/GlassPanel";
import { Reveal } from "@/components/fx/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LeadForm } from "@/components/forms/LeadForm";
import styles from "./LeadFormSection.module.css";

/**
 * Section 10 du blueprint : formulaire court « qui conclut » (3 étapes,
 * persistance Supabase) dans un GlassPanel. Focus ring en --accent.
 */
export function LeadFormSection() {
  return (
    <section id="devis" className={`fx-section ${styles.section}`}>
      <div className={styles.container}>
        <SectionHeading
          kicker="Votre devis"
          title="Parlez-nous de votre projet"
          subtitle="3 étapes, 30 secondes."
          size="compact"
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
