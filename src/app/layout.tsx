import type { Metadata } from "next";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-700.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "./globals.css";
import { GlowCursor } from "@/components/fx/GlowCursor";
import { LiquidBackground } from "@/components/fx/LiquidBackground";
import { LiquidRefractFilter } from "@/components/fx/LiquidRefractFilter";
import { MotionProvider } from "@/components/fx/MotionProvider";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: "XR VR Discovery — Animation VR pour centres commerciaux à Antananarivo",
  description:
    "XR Technology installe une animation VR clé en main dans votre centre commercial : 10 casques autonomes, animateurs formés, packs à partir de 1 600 000 Ar. Attirez le public, créez du trafic.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <a href="#contenu" className="skip-link">
          Aller au contenu
        </a>
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
