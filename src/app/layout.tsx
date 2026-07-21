import type { Metadata } from "next";
// Display v3 : Sora (grotesque géométrique). Space Grotesk conservé pour la
// comparaison /fx-lab tant que le choix n'est pas figé.
import "@fontsource/sora/latin-500.css";
import "@fontsource/sora/latin-600.css";
import "@fontsource/sora/latin-700.css";
import "@fontsource/sora/latin-800.css";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-700.css";
// Accent titres : Baloo 2 (mots ronds, façon « adventures » de la réf.).
import "@fontsource/baloo-2/latin-700.css";
import "@fontsource/baloo-2/latin-800.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "./globals.css";
import { GlowCursor } from "@/components/fx/GlowCursor";
import { LiquidBackground } from "@/components/fx/LiquidBackground";
import { LiquidRefractFilter } from "@/components/fx/LiquidRefractFilter";
import { MotionProvider } from "@/components/fx/MotionProvider";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { AttributionCapture } from "@/components/tracking/AttributionCapture";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: "XR VR Discovery | Animation VR clé en main à Antananarivo",
  description:
    "XR Technology déplace la VR jusqu'à vous : 10 casques dernière génération, animateurs XR et 8 offres (retail, entreprises, écoles, universités, tourisme, fondations, immobilier, évènementiel). Packs à partir de 750 000 Ar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {/* data-native-anchor : saut instantané + sémantique de focus native
            (un skip-link ne doit pas être animé). */}
        <a href="#contenu" className="skip-link" data-native-anchor>
          Aller au contenu
        </a>
        <AttributionCapture />
        <LiquidBackground />
        <LiquidRefractFilter />
        <MotionProvider>
          <SmoothScroll />
          {children}
          <GlowCursor />
        </MotionProvider>
      </body>
    </html>
  );
}
