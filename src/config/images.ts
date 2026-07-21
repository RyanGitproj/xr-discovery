/**
 * Manifeste des visuels du site. Les .svg sont des PLACEHOLDERS stylés aux
 * couleurs de la DA — les photos finales (générées via docs/images-brief.md)
 * les remplacent fichier par fichier : même nom de base en .webp dans
 * public/images/, puis mettre à jour `src` ici. Rien d'autre à toucher.
 */

export type ImageSlot = {
  src: string;
  alt: string;
  /** Dimensions intrinsèques — réservent le ratio (zéro CLS). */
  width: number;
  height: number;
};

export type VideoSlot = {
  webm: string;
  mp4: string;
  /** Frame de démarrage : ratio réservé (zéro CLS) + fallback reduced-motion. */
  poster: ImageSlot;
};

/**
 * Démo casque (portrait) du CTA final — convertie de docs/CASQUE VR3.mp4
 * (ffmpeg : VP9/WebM + H.264/MP4, 900px, ~5 Mo, lazy après first paint).
 */
export const casqueVideo: VideoSlot = {
  webm: "/videos/casque-vr.webm",
  mp4: "/videos/casque-vr.mp4",
  poster: {
    src: "/videos/casque-vr-poster.webp",
    alt: "Démonstration du casque VR Meta Quest 3 en action",
    width: 900,
    height: 1126,
  },
};

/** Logo officiel (lockup mascotte + wordmark, alpha) — navbar et footer. */
export const logoImage: ImageSlot = {
  src: "/images/logo-xr-vr-discovery.webp",
  alt: "XR VR Discovery — Antananarivo",
  width: 800,
  height: 203,
};

export const argumentImage: ImageSlot = {
  src: "/images/argument-effet-wow.webp",
  alt: "Gros plan d'un visage émerveillé sous un casque VR, reflets néon",
  width: 1600,
  height: 900,
};

export const prestaImage: ImageSlot = {
  src: "/images/prestation-cle-en-main.webp",
  alt: "L'équipe XR installe l'espace VR : casques alignés et habillage lumineux",
  width: 1600,
  height: 900,
};

/**
 * Scène « plongée Quest 3 » (ScrollStage — Immersion v2.1), calques empilés
 * fond → avant-plan. Placeholders SVG en attente de la génération
 * (docs/images-dive-brief.md) : Codex dépose les .webp dans
 * public/images/dive/ et passe les extensions ici, rien d'autre. Calques
 * décoratifs (aria-hidden posé par StageLayer) : alt vide assumé.
 */
export const diveImages = {
  mascotte: {
    src: "/images/dive/dive-mascotte.webp",
    alt: "",
    width: 1024,
    height: 1024,
  },
  universe: {
    src: "/images/dive/dive-universe.webp",
    alt: "",
    width: 2000,
    height: 1250,
  },
  /** Variante PORTRAIT : les volutes froides restent dans le cadre mobile
      (le cover du paysage 2000×1250 ampute les flancs). Art-direction via
      <picture> (≤ 767px), DiveSection. */
  universeMobile: {
    src: "/images/dive/dive-universe-mobile.webp",
    alt: "",
    width: 1080,
    height: 1920,
  },
  lensGlow: {
    src: "/images/dive/dive-lens-glow.webp",
    alt: "",
    width: 1200,
    height: 1200,
  },
  headsetBack: {
    src: "/images/dive/dive-quest3-back.webp",
    alt: "",
    width: 1600,
    height: 1200,
  },
  headsetFront: {
    src: "/images/dive/dive-quest3-front.webp",
    alt: "",
    width: 1600,
    height: 1200,
  },
  particles: {
    src: "/images/dive/dive-particles-front.webp",
    alt: "",
    width: 1600,
    height: 1000,
  },
} as const satisfies Record<string, ImageSlot>;

/** Bande « moments XR » (marquee) — 6 instantanés variés. */
export const galleryImages: readonly ImageSlot[] = [
  {
    src: "/images/galerie-01.webp",
    alt: "Deux amies rient pendant leur première expérience VR",
    width: 1200,
    height: 1200,
  },
  {
    src: "/images/galerie-02.webp",
    alt: "Enfant émerveillé, bras tendus, casque VR sur la tête",
    width: 1200,
    height: 1200,
  },
  {
    src: "/images/galerie-03.webp",
    alt: "Animateur XR guidant un participant devant les spectateurs",
    width: 1200,
    height: 1200,
  },
  {
    src: "/images/galerie-04.webp",
    alt: "File de visiteurs curieux devant l'espace XR illuminé",
    width: 1200,
    height: 1200,
  },
  {
    src: "/images/galerie-05.webp",
    alt: "Groupe posant pour un souvenir photo après la session VR",
    width: 1200,
    height: 1200,
  },
  {
    src: "/images/galerie-06.webp",
    alt: "Vue d'ensemble de l'animation VR au cœur de la galerie, de nuit",
    width: 1200,
    height: 1200,
  },
];
