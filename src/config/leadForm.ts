import { OFFER_LABELS } from "@/config/offers";
import type { Lead } from "@/lib/validations/lead";

/**
 * Libellés français du formulaire court « qui conclut » (2 étapes). Les
 * VALEURS vivent dans lib/validations/lead.ts (schéma unique) — ici
 * uniquement la présentation.
 */

export const SECTEUR_LABELS: Record<Lead["secteur"], string> = {
  ...OFFER_LABELS,
  autre: "Autre secteur",
};

/** Option « pack » vide — le visiteur ne s'engage sur aucun format. */
export const PACK_NONE_LABEL = "Je ne sais pas encore";

export const OBJECTIF_LABELS: Record<Lead["objectif"], string> = {
  trafic: "Attirer du public",
  notoriete: "Faire parler de vous",
  lancement: "Réussir un événement",
  "contenu-social": "Générer du contenu social",
};

export const BUDGET_LABELS: Record<Lead["budget"], string> = {
  "moins-2m": "Moins de 2 M Ar",
  "2-4m": "2 à 4 M Ar",
  "4-8m": "4 à 8 M Ar",
  "plus-8m": "Plus de 8 M Ar",
  "a-definir": "À définir ensemble",
};

/** Libellés nus — l'obligatoire est marqué par « * » (prop `required` des
    champs), jamais par une mention entre parenthèses. */
export const FIELD_LABELS: Record<keyof Lead, string> = {
  secteur: "Votre secteur",
  pack: "Pack envisagé",
  objectif: "Objectif principal",
  budget: "Budget",
  periode: "Période envisagée",
  nom: "Votre nom",
  telephone: "Téléphone / WhatsApp",
  email: "Email",
  participants: "Participants (approx.)",
  entreprise: "Entreprise / lieu",
  fonction: "Votre fonction",
};

export type FormStep = {
  title: string;
  fields: readonly (keyof Lead)[];
};

export const FORM_STEPS: readonly FormStep[] = [
  { title: "Votre projet", fields: ["secteur", "pack", "objectif", "budget", "periode"] },
  {
    title: "Vos coordonnées",
    fields: ["nom", "telephone", "email", "participants", "entreprise", "fonction"],
  },
];
