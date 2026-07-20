import {
  Briefcase,
  Building2,
  GraduationCap,
  HeartHandshake,
  Home,
  Megaphone,
  Plane,
  School,
  type LucideIcon,
} from "lucide-react";

/**
 * Les 8 offres sectorielles et leurs 21 packs — SOURCE DE VÉRITÉ : les
 * brochures officielles docs/Offres/*.pdf (prix, contenus, badges).
 * Les ids (offres ET packs) alimentent l'enum Zod du formulaire et les
 * colonnes `secteur`/`pack` de funnel_xr_discovery_leads : NE JAMAIS les
 * renommer après mise en prod. Prix toujours « à partir de », en ariary.
 */

export const OFFER_IDS = [
  "centres-commerciaux",
  "entreprise-rh-cse",
  "ecoles-colleges",
  "universite-formation",
  "tourisme-agences",
  "fondations-associations",
  "immobilier-showrooms",
  "marques-evenementiel",
] as const;

export type OfferId = (typeof OFFER_IDS)[number];

export type OfferPack = {
  id: string;
  name: string;
  tagline: string;
  /** Prix « à partir de », en ariary. */
  price: number;
  features: readonly string[];
  featured?: boolean;
  badge?: string;
};

export type Offer = {
  id: OfferId;
  /** Nom complet — libellé du formulaire et lecture des leads. */
  name: string;
  /** Libellé compact des tuiles du sélecteur. */
  shortName: string;
  icon: LucideIcon;
  /** Accroche brochure, affichée au-dessus des packs de l'offre active. */
  tagline: string;
  packs: readonly [OfferPack, OfferPack, OfferPack];
};

export const OFFERS: readonly Offer[] = [
  {
    id: "centres-commerciaux",
    name: "Centres commerciaux & retail",
    shortName: "Centres commerciaux",
    icon: Building2,
    tagline: "Transformez votre espace en une expérience qui attire, rassemble et fait parler.",
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
    ],
  },
  {
    id: "entreprise-rh-cse",
    name: "Entreprises, RH & CSE",
    shortName: "Entreprises & CSE",
    icon: Briefcase,
    tagline: "Vos équipes oublieront peut-être le discours. Pas l'expérience.",
    packs: [
      {
        id: "afterwork-vr",
        name: "Afterwork VR",
        tagline: "La pause originale qui crée l'enthousiasme.",
        price: 1_200_000,
        features: [
          "2 h d'animation",
          "4 casques VR",
          "1 animateur XR",
          "Expériences fun & découverte",
        ],
      },
      {
        id: "team-building-vr",
        name: "Team Building VR",
        tagline: "La demi-journée immersive qui rapproche les équipes.",
        price: 2_400_000,
        featured: true,
        features: [
          "Demi-journée d'animation",
          "6 casques VR",
          "2 animateurs XR",
          "Expériences de cohésion & sensations",
        ],
      },
      {
        id: "seminaire-premium",
        name: "Séminaire Premium",
        tagline: "La dimension premium de vos grands événements internes.",
        price: 4_900_000,
        features: [
          "Journée complète d'animation",
          "10 casques VR",
          "2 animateurs XR",
          "Vidéo souvenir + support photo",
        ],
      },
    ],
  },
  {
    id: "ecoles-colleges",
    name: "Écoles & collèges",
    shortName: "Écoles & collèges",
    icon: School,
    tagline: "Les élèves peuvent regarder une leçon. Ou entrer à l'intérieur.",
    packs: [
      {
        id: "classe-decouverte",
        name: "Classe Découverte",
        tagline: "L'activité éducative courte qui éveille la curiosité.",
        price: 900_000,
        features: [
          "2 h d'animation",
          "4 casques VR",
          "1 animateur XR",
          "Madagascar, monde & sciences",
        ],
      },
      {
        id: "journee-vr-educative",
        name: "Journée VR Éducative",
        tagline: "Plusieurs univers éducatifs en une expérience encadrée.",
        price: 1_900_000,
        featured: true,
        features: [
          "Demi-journée d'animation",
          "6 casques VR",
          "2 animateurs XR",
          "Histoire, géographie, océans & espace",
        ],
      },
      {
        id: "parcours-pedagogique-360",
        name: "Parcours Pédagogique 360",
        tagline: "La journée immersive adaptée au projet de l'établissement.",
        price: 4_200_000,
        features: [
          "Journée complète d'animation",
          "10 casques VR",
          "2 animateurs XR",
          "Module sur mesure + support photo",
        ],
      },
    ],
  },
  {
    id: "universite-formation",
    name: "Universités & formation",
    shortName: "Universités",
    icon: GraduationCap,
    tagline: "Les apprenants peuvent écouter une formation. Ou entrer dans l'expérience.",
    packs: [
      {
        id: "atelier-immersion",
        name: "Atelier Immersion",
        tagline: "L'atelier court pour découvrir langues et métiers.",
        price: 1_100_000,
        features: [
          "2 h d'animation",
          "4 casques VR",
          "1 animateur XR",
          "Langues & découverte des métiers",
        ],
      },
      {
        id: "skills-innovation",
        name: "Skills & Innovation",
        tagline: "L'expérience centrée compétences et projection.",
        price: 2_400_000,
        featured: true,
        features: [
          "Demi-journée d'animation",
          "6 casques VR",
          "2 animateurs XR",
          "Soft skills & orientation",
        ],
      },
      {
        id: "formation-creator-360",
        name: "Formation Creator 360",
        tagline: "Les usages concrets de la création immersive.",
        price: 5_500_000,
        features: [
          "Journée complète d'animation",
          "10 casques VR",
          "2 animateurs XR",
          "Initiation captation & montage 360°",
        ],
      },
    ],
  },
  {
    id: "tourisme-agences",
    name: "Tourisme & agences de voyage",
    shortName: "Tourisme",
    icon: Plane,
    tagline: "Faites voyager vos clients avant même leur départ.",
    packs: [
      {
        id: "demo-destination",
        name: "Démo Destination",
        tagline: "La première immersion qui éveille l'envie de partir.",
        price: 1_500_000,
        features: [
          "2 h d'animation",
          "4 casques VR",
          "1 animateur XR",
          "Découverte de Madagascar",
        ],
      },
      {
        id: "experience-sejour",
        name: "Expérience Séjour",
        tagline: "Vos clients se projettent dans leur séjour.",
        price: 3_200_000,
        featured: true,
        badge: "Le plus choisi",
        features: [
          "Demi-journée d'animation",
          "6 casques VR",
          "2 animateurs XR",
          "Hôtels, circuits & plages",
        ],
      },
      {
        id: "showroom-tourisme-360",
        name: "Showroom Tourisme 360",
        tagline: "Votre destination en expérience immersive prête à présenter.",
        price: 7_900_000,
        features: [
          "Journée complète d'animation",
          "10 casques VR",
          "2 animateurs XR",
          "Captation 360° d'un site + montage",
        ],
      },
    ],
  },
  {
    id: "fondations-associations",
    name: "Fondations & associations",
    shortName: "Fondations & assos",
    icon: HeartHandshake,
    tagline: "Faites découvrir Madagascar et le monde autrement.",
    packs: [
      {
        id: "vr-solidaire",
        name: "VR Solidaire",
        tagline: "La première expérience qui éveille la curiosité et crée du lien.",
        price: 750_000,
        features: [
          "2 h d'animation",
          "4 casques VR",
          "1 animateur XR",
          "Sensibilisation & découverte",
        ],
      },
      {
        id: "impact-educatif",
        name: "Impact Éducatif",
        tagline: "Vivre le sujet pour mieux le comprendre et le retenir.",
        price: 1_600_000,
        featured: true,
        badge: "Le plus choisi",
        features: [
          "Demi-journée d'animation",
          "6 casques VR",
          "2 animateurs XR",
          "Contenus Madagascar, culture & monde",
        ],
      },
      {
        id: "mission-immersive",
        name: "Mission Immersive",
        tagline: "La journée qui transforme votre mission en expérience collective.",
        price: 3_800_000,
        features: [
          "Journée complète d'animation",
          "10 casques VR",
          "2 animateurs XR",
          "Contenu personnalisé + reportage photo",
        ],
      },
    ],
  },
  {
    id: "immobilier-showrooms",
    name: "Immobilier & showrooms",
    shortName: "Immobilier",
    icon: Home,
    tagline: "Un projet peut être expliqué. Ou déjà être vécu.",
    packs: [
      {
        id: "visite-vr-commerciale",
        name: "Visite VR Commerciale",
        tagline: "Le bien découvert dans une expérience immersive accessible.",
        price: 1_800_000,
        features: [
          "2 h d'animation",
          "4 casques VR",
          "1 animateur XR",
          "Visite immersive de biens",
        ],
      },
      {
        id: "vente-premium-360",
        name: "Vente Premium 360",
        tagline: "La présentation qui valorise vos biens premium.",
        price: 4_500_000,
        featured: true,
        features: [
          "Demi-journée d'animation",
          "6 casques VR",
          "2 animateurs XR",
          "Vidéo 360°, photos & visite au casque",
        ],
      },
      {
        id: "projet-futur-vr",
        name: "Projet Futur en VR",
        tagline: "Le projet futur, visualisé avant sa réalisation.",
        price: 8_900_000,
        features: [
          "Journée complète d'animation",
          "10 casques VR",
          "2 animateurs XR",
          "Maquette ou projection 360°",
        ],
      },
    ],
  },
  {
    id: "marques-evenementiel",
    name: "Marques & évènementiel",
    shortName: "Marques & salons",
    icon: Megaphone,
    tagline: "Une marque peut être vue. Ou vécue.",
    packs: [
      {
        id: "stand-vr",
        name: "Stand VR",
        tagline: "Le point d'attraction visible autour de votre espace.",
        price: 1_900_000,
        features: [
          "3 h d'animation",
          "4 casques VR",
          "1 animateur XR",
          "Expérience d'attraction",
        ],
      },
      {
        id: "brand-experience",
        name: "Brand Experience",
        tagline: "Votre marque associée à une expérience mémorable.",
        price: 4_200_000,
        featured: true,
        features: [
          "Demi-journée d'animation",
          "6 casques VR",
          "2 animateurs XR",
          "Branding & photos",
        ],
      },
      {
        id: "salon-premium-360",
        name: "Salon Premium 360",
        tagline: "L'expérience complète qui produit du contenu immersif.",
        price: 8_500_000,
        features: [
          "Journée complète d'animation",
          "10 casques VR",
          "2 animateurs XR",
          "Captation + montage vidéo 360°",
        ],
      },
    ],
  },
];

const OFFERS_BY_ID = new Map(OFFERS.map((offer) => [offer.id, offer]));

export function getOffer(id: OfferId): Offer {
  const offer = OFFERS_BY_ID.get(id);
  if (offer === undefined) throw new Error(`Offre inconnue : ${id}`);
  return offer;
}

/** Prix d'appel d'une offre (tuiles du sélecteur) : le pack le moins cher. */
export function offerPriceFrom(offer: Offer): number {
  return Math.min(...offer.packs.map((pack) => pack.price));
}

/** Libellés du champ « secteur » du formulaire — dérivés, jamais dupliqués. */
export const OFFER_LABELS = Object.fromEntries(
  OFFERS.map((offer) => [offer.id, offer.name]),
) as Record<OfferId, string>;

/** Ids de packs (uniques globalement — invariant testé) : enum Zod du champ « pack ». */
export const ALL_PACK_IDS: readonly string[] = OFFERS.flatMap((offer) =>
  offer.packs.map((pack) => pack.id),
);
