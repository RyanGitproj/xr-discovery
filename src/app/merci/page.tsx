import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { Meteors } from "@/components/fx/Meteors";
import { LeadConversionTracker } from "@/components/tracking/LeadConversionTracker";
import styles from "./merci.module.css";

export const metadata: Metadata = {
  title: "Merci | XR VR Discovery",
  robots: { index: false, follow: false },
};

/** Confirmation post-soumission, accessible uniquement avec le cookie httpOnly (30 min). */
export default async function MerciPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("xr_lead") === undefined) redirect("/");

  return (
    <main id="contenu" className={styles.main}>
      <LeadConversionTracker />
      <Meteors count={3} />
      <GlassPanel className={styles.panel}>
        <CheckCircle2 aria-hidden="true" className={styles.icon} />
        <h1 className={styles.title}>Demande bien reçue !</h1>
        <p className={styles.body}>
          Merci pour votre confiance. Notre équipe vous recontacte rapidement par téléphone
          ou par email avec la solution adaptée à votre projet.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.back}>
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </GlassPanel>
    </main>
  );
}
