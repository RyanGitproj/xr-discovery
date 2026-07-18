import {
  BarChart3,
  Building2,
  Camera,
  Headset,
  MapPin,
  Megaphone,
  MessagesSquare,
  Paintbrush,
  PartyPopper,
  ShieldCheck,
  Store,
  Truck,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { TextSegment } from "@/components/fx/TextGenerate";

/**
 * Contenu de la landing « Centres commerciaux & retail » (univers pilote).
 * SOURCE DE VÉRITÉ : les infographies XR dans docs/content/ (guide commercial,
 * fiche d'appel, fiche offre retail). RÈGLES : aucun texte ni prix en dur dans
 * les sections ; prix toujours « à partir de » ; ne jamais avancer un chiffre
 * ou un engagement absent des infographies (fiche d'appel, bloc 6).
 */

export const navLinks = [
  { label: "Publics", href: "#publics" },
  { label: "Packs", href: "#packs" },
  { label: "Déploiement", href: "#deploiement" },
  { label: "Questions", href: "#questions" },
] as const;

export const hero = {
  kicker: "XR VR Discovery · Antananarivo",
  titleSegments: [
    { text: "Entrez dans", variant: "solid", block: true },
    { text: "une autre", variant: "outline", block: true },
    { text: "réalité", variant: "outline", block: true },
  ] satisfies readonly TextSegment[],
  subtitle:
    "La découverte VR qui se déplace jusqu'à vous : 10 casques dernière génération et des animateurs XR expérimentés pour attirer le public, créer du trafic et faire parler de votre lieu.",
  ctaPrimary: "Demander un devis",
  ctaWhatsApp: "Discuter sur WhatsApp",
  whatsappIntro:
    "Bonjour XR Technology ! Je souhaite en savoir plus sur l'animation VR pour mon centre / magasin.",
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
  { icon: Store, label: "Formats retail & pop-up" },
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
  cta: "Voir les packs",
  ctaHref: "#packs",
  gyroCta: "Activer l'effet 3D",
} as const;

export type AudienceCard = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export const audienceSection = {
  kicker: "À qui s'adresse l'offre",
  title: "Pensé pour les lieux qui vivent du passage",
  cards: [
    {
      icon: Building2,
      title: "Centres commerciaux",
      body: "Générez de l'affluence dans votre galerie avec une animation qui se voit de loin et fait revenir le public.",
    },
    {
      icon: Store,
      title: "Enseignes & retailers",
      body: "Divertissez vos clients et renforcez l'image innovante de votre marque, directement sur votre point de vente.",
    },
    {
      icon: PartyPopper,
      title: "Pop-up events",
      body: "Un format événementiel prêt à l'emploi : l'installation est simple et l'expérience crée du partage.",
    },
    {
      icon: Megaphone,
      title: "Activations grand public",
      body: "Une animation famille / grand public qui capte l'attention et fait parler de votre opération.",
    },
  ] satisfies readonly AudienceCard[],
  need: {
    kicker: "Le besoin",
    title: "Créer du trafic et faire parler de votre lieu",
    body: "Générer de l'affluence, divertir le public, créer du partage et renforcer une image innovante : c'est exactement ce pour quoi l'animation VR mobile est conçue.",
  },
} as const;

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
      body: "Des expériences fun et à sensations, pensées pour les familles comme pour le grand public.",
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
  ] satisfies readonly AudienceCard[],
  presta: {
    kicker: "La prestation",
    title: "Clé en main, de bout en bout",
    body: "Brief opérationnel, déplacement, installation, 10 casques VR dernière génération, animateurs XR et gestion des flux de participants — vous n'avez rien à gérer.",
  },
} as const;

export type Pack = {
  id: string;
  name: string;
  tagline: string;
  /** Prix « à partir de », en ariary. */
  price: number;
  features: readonly string[];
  featured?: boolean;
  badge?: string;
};

export const packsSection = {
  kicker: "Nos packs",
  title: "Trois formats pour créer l'événement",
  subtitle: "Tarifs « à partir de » — sur devis selon lieu, durée et options.",
  packs: [
    {
      id: "animation-trafic",
      name: "Animation Trafic",
      tagline: "L'animation découverte qui anime votre lieu.",
      price: 1_600_000,
      features: [
        "3 h d'animation",
        "4 casques VR",
        "1 animateur XR",
        "Expériences fun & découverte",
      ],
    },
    {
      id: "temps-fort",
      name: "Temps Fort VR",
      tagline: "Le format des temps forts et des week-ends.",
      price: 3_300_000,
      featured: true,
      badge: "Idéal week-ends",
      features: [
        "Demi-journée d'animation",
        "6 casques VR",
        "2 animateurs XR",
        "Trafic, photos & souvenirs",
      ],
    },
    {
      id: "pop-up-premium-360",
      name: "Pop-up Premium 360",
      tagline: "La journée complète, format premium.",
      price: 6_900_000,
      features: [
        "Journée complète d'animation",
        "10 casques VR",
        "2 animateurs XR",
        "Animation retail + mini récap vidéo",
      ],
    },
  ] satisfies readonly Pack[],
  pricePrefix: "à partir de",
  cta: "Choisir ce pack",
} as const;

export const argumentSection = {
  kicker: "Pourquoi ça marche",
  quote:
    "La VR crée l'effet « wow » qui capte l'attention dès la première seconde, génère de l'affluence, prolonge le temps de visite et rend votre lieu mémorable et visible.",
  optionsTitle: "Options recommandées",
  options: [
    "Branding enseigne",
    "Borne photo",
    "Influence & vidéo",
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
        "Oui : le format est pensé famille et grand public, accessible à un large public. Nos animateurs XR accueillent chaque participant et accompagnent la découverte.",
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
        "Le format est idéal pour les temps forts et les week-ends : anniversaires du centre, lancements, fêtes, opérations commerciales. Les formats retail & pop-up s'adaptent à votre calendrier.",
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

/** Les 5 étapes « Déploiement XR » de l'infographie retail, à l'identique. */
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
      title: "Animation grand public",
      body: "Accueil, découverte, gestion des flux — fun garanti.",
    },
    {
      icon: BarChart3,
      title: "Bilan",
      body: "Récap et retours pour vos KPI.",
    },
  ] satisfies readonly DeployStep[],
} as const;

export const finalCtaSection = {
  title: "Attirez le public avec la VR",
  subtitle:
    "Racontez-nous votre projet : nous revenons vers vous rapidement avec la solution adaptée.",
  ctaPrimary: "Demander un devis",
  ctaWhatsApp: "Discuter sur WhatsApp",
} as const;

export const footerContent = {
  baseline:
    "La découverte VR qui se déplace jusqu'à vous : animations immersives, culture & éducation, marketing immersif et captation 360, en expériences clés en main.",
  universesTitle: "Nos 8 univers",
  universes: [
    { label: "Centres commerciaux & retail", current: true },
    { label: "Entreprises, RH & CSE", current: false },
    { label: "Marques & salons", current: false },
    { label: "Immobilier & showrooms", current: false },
    { label: "Tourisme & agences", current: false },
    { label: "Fondations & associations", current: false },
    { label: "Universités & formation", current: false },
    { label: "Écoles & collèges", current: false },
  ],
  contactTitle: "Contact",
  mentions: "© 2026 XR Technology — Antananarivo, Madagascar",
} as const;
