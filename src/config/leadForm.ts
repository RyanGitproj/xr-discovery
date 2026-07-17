import type { Lead } from "@/lib/validations/lead";

/**
 * Libellés français des 9 questions de qualification (fiche d'appel) +
 * découpage en étapes. Les VALEURS vivent dans lib/validations/lead.ts
 * (schéma unique) — ici uniquement la présentation.
 */

export const PROJECT_LABELS: Record<Lead["projet"], string> = {
  "animation-galerie": "Animation en galerie",
  "temps-fort": "Temps fort commercial",
  "pop-up-premium": "Pop-up événementiel",
  autre: "Autre projet",
};

export const PUBLIC_LABELS: Record<Lead["public"], string> = {
  familles: "Familles",
  jeunes: "Ados & jeunes adultes",
  "clients-enseigne": "Clients d'une enseigne",
  "grand-public": "Grand public",
};

export const PARTICIPANTS_LABELS: Record<Lead["participants"], string> = {
  "moins-100": "Moins de 100",
  "100-300": "100 à 300",
  "300-1000": "300 à 1 000",
  "plus-1000": "Plus de 1 000",
};

export const DUREE_LABELS: Record<Lead["duree"], string> = {
  journee: "Une journée",
  weekend: "Un week-end",
  semaine: "Une semaine",
  plus: "Plus longtemps",
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

export const DECIDEUR_LABELS: Record<Lead["decideur"], string> = {
  decide: "Je décide",
  recommande: "Je recommande en interne",
  renseigne: "Je me renseigne",
};

export const FIELD_LABELS: Record<keyof Lead, string> = {
  projet: "Votre projet",
  public: "Public visé",
  participants: "Participants estimés",
  date: "Période envisagée",
  lieu: "Lieu",
  duree: "Durée",
  objectif: "Objectif principal",
  budget: "Budget",
  decideur: "Votre rôle",
  nom: "Votre nom",
  telephone: "Téléphone / WhatsApp",
  email: "Email (optionnel)",
};

export type FormStep = {
  title: string;
  fields: readonly (keyof Lead)[];
};

export const FORM_STEPS: readonly FormStep[] = [
  { title: "Votre projet", fields: ["projet", "public", "participants"] },
  { title: "Logistique", fields: ["date", "lieu", "duree"] },
  { title: "Cadrage", fields: ["objectif", "budget", "decideur"] },
  { title: "Vos coordonnées", fields: ["nom", "telephone", "email"] },
];
