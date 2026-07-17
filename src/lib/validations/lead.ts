import { z } from "zod";

/** Les 9 questions de la fiche d'appel + coordonnées. Schéma UNIQUE client + serveur. */

export const PROJECT_VALUES = ["animation-galerie", "temps-fort", "pop-up-premium", "autre"] as const;
export const PUBLIC_VALUES = ["familles", "jeunes", "clients-enseigne", "grand-public"] as const;
export const PARTICIPANTS_VALUES = ["moins-100", "100-300", "300-1000", "plus-1000"] as const;
export const DUREE_VALUES = ["journee", "weekend", "semaine", "plus"] as const;
export const OBJECTIF_VALUES = ["trafic", "notoriete", "lancement", "contenu-social"] as const;
export const BUDGET_VALUES = ["moins-2m", "2-4m", "4-8m", "plus-8m", "a-definir"] as const;
export const DECIDEUR_VALUES = ["decide", "recommande", "renseigne"] as const;

const PHONE_REGEX = /^\+?[0-9 ().-]{7,20}$/;

export const leadSchema = z.object({
  projet: z.enum(PROJECT_VALUES, "Choisissez un type de projet."),
  public: z.enum(PUBLIC_VALUES, "Choisissez le public visé."),
  participants: z.enum(PARTICIPANTS_VALUES, "Estimez le nombre de participants."),
  date: z
    .string()
    .trim()
    .min(2, "Indiquez la période envisagée.")
    .max(120, "120 caractères maximum."),
  lieu: z
    .string()
    .trim()
    .min(2, "Indiquez le lieu (centre, ville...).")
    .max(120, "120 caractères maximum."),
  duree: z.enum(DUREE_VALUES, "Choisissez une durée."),
  objectif: z.enum(OBJECTIF_VALUES, "Choisissez votre objectif principal."),
  budget: z.enum(BUDGET_VALUES, "Choisissez une fourchette de budget."),
  decideur: z.enum(DECIDEUR_VALUES, "Précisez votre rôle dans la décision."),
  nom: z.string().trim().min(2, "Indiquez votre nom.").max(120, "120 caractères maximum."),
  telephone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "Numéro invalide — format attendu : +261 34 00 000 00."),
  email: z.union([z.literal(""), z.email("Email invalide.")]),
});

export type Lead = z.infer<typeof leadSchema>;
