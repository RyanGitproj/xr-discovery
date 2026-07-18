import type { Lead } from "@/lib/validations/lead";

/**
 * Libellés français du formulaire court « qui conclut » (2 étapes). Les
 * VALEURS vivent dans lib/validations/lead.ts (schéma unique) — ici
 * uniquement la présentation.
 */

export const TYPE_ORGANISATION_LABELS: Record<Lead["typeOrganisation"], string> = {
  "centre-commercial": "Centre commercial",
  "enseigne-retail": "Enseigne & retail",
  "pop-up-event": "Pop-up & événement",
  autre: "Autre",
};

export const OBJECTIF_LABELS: Record<Lead["objectif"], string> = {
  trafic: "Créer du trafic",
  notoriete: "Faire parler du lieu",
  lancement: "Réussir un lancement",
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
  typeOrganisation: "Vous êtes",
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
  { title: "Votre projet", fields: ["typeOrganisation", "objectif", "budget", "periode"] },
  {
    title: "Vos coordonnées",
    fields: ["nom", "telephone", "email", "participants", "entreprise", "fonction"],
  },
];
