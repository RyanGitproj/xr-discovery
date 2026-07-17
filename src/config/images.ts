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

/** Même ordre que audienceSection.cards (zip par index). */
export const audienceImages: readonly ImageSlot[] = [
  {
    src: "/images/audience-centres-commerciaux.webp",
    alt: "Visiteurs casqués au cœur d'une galerie commerciale animée",
    width: 1200,
    height: 800,
  },
  {
    src: "/images/audience-enseignes-retailers.webp",
    alt: "Client testant la VR devant une boutique, accompagné d'un animateur XR",
    width: 1200,
    height: 800,
  },
  {
    src: "/images/audience-pop-up-events.webp",
    alt: "Stand pop-up XR illuminé au milieu d'un événement",
    width: 1200,
    height: 800,
  },
  {
    src: "/images/audience-activations-grand-public.webp",
    alt: "Famille souriante découvrant la réalité virtuelle en public",
    width: 1200,
    height: 800,
  },
];

/** Indexé par Pack.id (packsSection.packs). */
export const packImages: Record<string, ImageSlot> = {
  "animation-trafic": {
    src: "/images/pack-animation-trafic.webp",
    alt: "Petit groupe en pleine session VR encadré par un animateur",
    width: 1600,
    height: 1000,
  },
  "temps-fort": {
    src: "/images/pack-temps-fort-vr.webp",
    alt: "Foule du week-end autour de l'espace VR en galerie",
    width: 1600,
    height: 1000,
  },
  "pop-up-premium-360": {
    src: "/images/pack-pop-up-premium-360.webp",
    alt: "Espace premium scénographié avec dix casques VR",
    width: 1600,
    height: 1000,
  },
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
  universe: {
    src: "/images/dive/dive-universe.svg",
    alt: "",
    width: 2000,
    height: 1250,
  },
  lensGlow: {
    src: "/images/dive/dive-lens-glow.svg",
    alt: "",
    width: 1200,
    height: 1200,
  },
  headsetBack: {
    src: "/images/dive/dive-quest3-back.svg",
    alt: "",
    width: 1600,
    height: 1200,
  },
  headsetFront: {
    src: "/images/dive/dive-quest3-front.svg",
    alt: "",
    width: 1600,
    height: 1200,
  },
  particles: {
    src: "/images/dive/dive-particles-front.svg",
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
