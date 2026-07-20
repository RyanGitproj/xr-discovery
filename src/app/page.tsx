import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ArgumentSection } from "@/components/sections/ArgumentSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { DeploymentSection } from "@/components/sections/DeploymentSection";
import { DiveSection } from "@/components/sections/DiveSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { Hero } from "@/components/sections/Hero";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { ObjectionsSection } from "@/components/sections/ObjectionsSection";
import { OffersSection } from "@/components/sections/OffersSection";
import { ReassuranceBar } from "@/components/sections/ReassuranceBar";

/** Le récit : promesse → confiance → immersion (plongée) → preuve → offre
    (8 univers) → bénéfices → objections → process → action. */
export default function HomePage() {
  return (
    <>
      <Header />
      <main id="contenu">
        <Hero />
        <ReassuranceBar />
        <DiveSection />
        <GallerySection />
        <OffersSection />
        <BenefitsSection />
        <ArgumentSection />
        <ObjectionsSection />
        <DeploymentSection />
        <FinalCtaSection />
        <LeadFormSection />
      </main>
      <Footer />
    </>
  );
}
