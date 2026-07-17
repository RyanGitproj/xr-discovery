import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { Meteors } from "@/components/fx/Meteors";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { siteConfig } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/format/whatsapp";
import styles from "./merci.module.css";

export const metadata: Metadata = {
  title: "Merci — XR VR Discovery",
  robots: { index: false, follow: false },
};

/** Confirmation post-soumission — accessible uniquement avec le cookie httpOnly (30 min). */
export default async function MerciPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("xr_lead") === undefined) redirect("/");

  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsappNumber,
    "Bonjour XR Technology ! Je viens d'envoyer ma demande de devis via le site.",
  );

  return (
    <main id="contenu" className={styles.main}>
      <Meteors count={3} />
      <GlassPanel className={styles.panel}>
        <CheckCircle2 aria-hidden="true" className={styles.icon} />
        <h1 className={styles.title}>Demande bien reçue !</h1>
        <p className={styles.body}>
          Merci pour votre confiance. Notre équipe revient vers vous rapidement avec la
          solution adaptée. Pour aller plus vite, continuez la conversation sur WhatsApp.
        </p>
        <div className={styles.actions}>
          <OutlineButton href={whatsappHref}>Continuer sur WhatsApp</OutlineButton>
          <Link href="/" className={styles.back}>
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </GlassPanel>
    </main>
  );
}
