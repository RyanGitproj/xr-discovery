import {
  BarChart3,
  Camera,
  Headset,
  MapPin,
  MessagesSquare,
  Paintbrush,
  PartyPopper,
  ShieldCheck,
  SlidersHorizontal,
  Truck,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { TextSegment } from "@/components/fx/TextGenerate";
import { OFFERS } from "@/config/offers";

/**
 * Contenu de la landing multi-offres (8 univers — voir config/offers.ts pour
 * le catalogue). SOURCE DE VÉRITÉ : les brochures docs/Offres/*.pdf et les
 * infographies XR dans docs/content/. RÈGLES : aucun texte ni prix en dur
 * dans les sections ; prix toujours « à partir de » ; ne jamais avancer un
 * chiffre ou un engagement absent de ces sources.
 */

/* Navigation interne par scrollTo (aucune ancre d'URL) : `id` = id de section. */
export const navLinks = [
  { label: "Offres", id: "offres" },
  { label: "Déploiement", id: "deploiement" },
  { label: "Questions", id: "questions" },
] as const;

export const hero = {
  kicker: "XR VR Discovery · Antananarivo",
  titleSegments: [
    { text: "Entrez dans", variant: "solid", block: true },
    { text: "une autre", variant: "outline", block: true },
    { text: "réalité", variant: "outline", block: true },
  ] satisfies readonly TextSegment[],
  subtitle:
    "La VR qui se déplace jusqu'à vous : 10 casques dernière génération et des animateurs XR expérimentés pour créer l'événement, quel que soit votre univers.",
  ctaPrimary: "Demander un devis",
  /** Labels HUD de la scène casque. « 8 univers » = les 8 segments servis
      (guide commercial), pas des contenus immersifs. */
  hud: {
    casques: { value: 10, label: "casques VR" },
    univers: { value: 8, label: "univers XR" },
  },
} as const;

export type ReassuranceItem = {
  icon: LucideIcon;
  label: string;
};

/** Bandeau de preuves : reprend les 4 marqueurs du pied des infographies. */
export const reassuranceItems: readonly ReassuranceItem[] = [
  { icon: MapPin, label: "Basés à Antananarivo" },
  { icon: Truck, label: "Déplacements sur site" },
  { icon: Headset, label: "10 casques VR dernière génération" },
  { icon: Users, label: "Animateurs XR expérimentés" },
  { icon: SlidersHorizontal, label: "Formats adaptés à chaque univers" },
];

/**
 * Scène immersive « plongée Quest 3 » (Immersion v2.1) — textes seuls, le
 * storyboard vit dans DiveSection. « Meta Quest 3 » : usage descriptif du
 * matériel réellement déployé (décision produit), AUCUN logo dans les
 * visuels (docs/images-dive-brief.md). Claims strictement repris du hero et
 * du bandeau de réassurance.
 */
export const diveSection = {
  kicker: "L'expérience",
  title: "Mettez le casque",
  intro:
    "Meta Quest 3 — 10 casques autonomes dernière génération, animés par une équipe XR expérimentée.",
  reveal: {
    title: "Un autre monde s'ouvre à vos visiteurs",
    body: "Des expériences immersives choisies pour votre public : vos visiteurs plongent, votre lieu attire, on parle de vous.",
  },
  cta: "Découvrir les offres",
  ctaScrollTo: "offres",
  gyroCta: "Activer l'effet 3D",
} as const;

export type IconCard = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export const benefitsSection = {
  kicker: "Ce que XR VR apporte",
  title: "Une attraction qui travaille pour vous",
  cards: [
    {
      icon: Zap,
      title: "Attraction immédiate",
      body: "Une animation à fort pouvoir d'attraction : l'effet « wow » de la VR capte l'attention dès la première seconde.",
    },
    {
      icon: PartyPopper,
      title: "Fun & sensations",
      body: "Des expériences fun, immersives et à sensations, choisies pour votre public : visiteurs, collaborateurs, élèves ou clients.",
    },
    {
      icon: Camera,
      title: "Souvenirs photo & vidéo",
      body: "Les participants repartent avec des souvenirs photo et vidéo qui prolongent l'événement sur les réseaux.",
    },
    {
      icon: ShieldCheck,
      title: "Simple et encadré",
      body: "Installation simple sur votre site et gestion des flux de participants par nos animateurs XR.",
    },
  ] satisfies readonly IconCard[],
  presta: {
    kicker: "La prestation",
    title: "Clé en main, de bout en bout",
    body: "Brief opérationnel, déplacement, installation, 10 casques VR dernière génération, animateurs XR et gestion des flux de participants — vous n'avez rien à gérer.",
  },
} as const;

/** Section Offres : le catalogue (8 offres × 3 packs) vit dans config/offers.ts. */
export const offersSection = {
  kicker: "Nos offres",
  title: "Huit univers, trois formats chacun",
  subtitle:
    "Choisissez votre secteur — chaque offre se décline en trois packs. Tarifs « à partir de », sur devis selon lieu, durée et options.",
  selectorLabel: "Choisissez votre secteur",
  hint: "Cliquez sur un secteur — les packs s'adaptent.",
  pricePrefix: "à partir de",
  cta: "Choisir ce pack",
} as const;

export const argumentSection = {
  kicker: "Pourquoi ça marche",
  quote:
    "La VR crée l'effet « wow » qui capte l'attention dès la première seconde, rassemble vos publics et rend votre lieu, votre marque ou votre événement mémorable.",
  optionsTitle: "Options recommandées",
  options: [
    "Branding personnalisé",
    "Borne photo",
    "Captation 360°",
    "Animateur supplémentaire",
    "Mini récap social media",
  ],
} as const;

export const objectionsSection = {
  kicker: "Questions fréquentes",
  title: "Ce qu'on nous demande avant de se lancer",
  items: [
    {
      question: "Est-ce accessible à tout le monde ?",
      answer:
        "Oui : aucune connaissance technique n'est nécessaire — visiteurs, collaborateurs, élèves ou clients, chacun est accueilli, équipé et guidé par un animateur XR.",
    },
    {
      question: "Le format est-il sécurisé ?",
      answer:
        "Oui. L'installation est préparée en amont sur la base d'un brief opérationnel, la mise en place est rapide et sécurisée, et nos animateurs gèrent les flux de participants pendant toute l'animation.",
    },
    {
      question: "Combien de visiteurs peuvent participer ?",
      answer:
        "La rotation des participants est rapide et encadrée par nos animateurs. La capacité exacte est validée avec vous selon le lieu, la durée et le public attendu.",
    },
    {
      question: "Quand programmer l'animation ?",
      answer:
        "À chaque temps fort son format : week-ends et lancements en retail, team buildings et séminaires, journées pédagogiques, salons, portes ouvertes… Chaque offre s'adapte à votre calendrier.",
    },
    {
      question: "Comment sont fixés les tarifs ?",
      answer:
        "Tous nos tarifs s'entendent « à partir de » : le devis exact dépend du lieu, de la durée et des options choisies. Racontez-nous votre projet et nous revenons vers vous rapidement avec la solution adaptée.",
    },
  ],
} as const;

export type DeployStep = {
  icon: LucideIcon;
  title: string;
  body: string;
};

/** Les 5 étapes « Déploiement XR » — déroulé commun aux 8 offres (brochures). */
export const deploymentSection = {
  kicker: "Déploiement XR",
  title: "Cinq étapes, zéro friction",
  steps: [
    {
      icon: MessagesSquare,
      title: "Brief",
      body: "Cadrage de vos objectifs et du public ciblé.",
    },
    {
      icon: Paintbrush,
      title: "Préparation",
      body: "Choix des expériences et plan d'animation.",
    },
    {
      icon: Wrench,
      title: "Installation",
      body: "Mise en place rapide et sécurisée sur votre site.",
    },
    {
      icon: Users,
      title: "Animation encadrée",
      body: "Accueil, découverte, gestion des flux — l'expérience est guidée de bout en bout.",
    },
    {
      icon: BarChart3,
      title: "Bilan",
      body: "Récap et retours pour vos KPI.",
    },
  ] satisfies readonly DeployStep[],
} as const;

export const finalCtaSection = {
  title: "Créez l'événement avec la VR",
  subtitle:
    "Une immersion Meta Quest 3 comme si vous y étiez — le formulaire de devis est juste en dessous.",
  soundOnLabel: "Activer le son",
  soundOffLabel: "Couper le son",
} as const;

export const footerContent = {
  baseline:
    "La découverte VR qui se déplace jusqu'à vous : animations immersives, culture & éducation, marketing immersif et captation 360, en expériences clés en main.",
  universesTitle: "Nos 8 univers",
  /** Dérivé du catalogue — les 8 offres sont toutes servies par la landing. */
  universes: OFFERS.map((offer) => offer.name),
  contactTitle: "Contact",
  mentions: "© 2026 XR Technology — Antananarivo, Madagascar",
} as const;
