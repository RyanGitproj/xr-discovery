import { z } from "zod";
import { OFFER_IDS, getOffer } from "@/config/offers";

/**
 * Formulaire « qui conclut » : qualification (secteur, pack, objectif,
 * budget, période) + coordonnées. Schéma UNIQUE client + serveur. Les
 * libellés vivent dans config/leadForm.ts.
 */

/** Les 8 offres (ids de config/offers.ts) + « autre » — valeurs DB `secteur`. */
export const SECTEUR_VALUES = [...OFFER_IDS, "autre"] as const;
export const OBJECTIF_VALUES = ["trafic", "notoriete", "lancement", "contenu-social"] as const;
export const BUDGET_VALUES = ["moins-2m", "2-4m", "4-8m", "plus-8m", "a-definir"] as const;

/** E.164 — le format que produit PhoneField (react-phone-number-input). */
const PHONE_E164_REGEX = /^\+[1-9]\d{6,14}$/;

const leadObject = z.object({
  secteur: z.enum(SECTEUR_VALUES, "Indiquez votre secteur."),
  /** Optionnel ("" = pas encore choisi) — cohérence secteur/pack en superRefine. */
  pack: z.string(),
  objectif: z.enum(OBJECTIF_VALUES, "Choisissez votre objectif principal."),
  budget: z.enum(BUDGET_VALUES, "Choisissez une fourchette de budget."),
  periode: z
    .string()
    .trim()
    .min(2, "Indiquez la période envisagée.")
    .max(120, "120 caractères maximum."),
  nom: z.string().trim().min(2, "Indiquez votre nom.").max(120, "120 caractères maximum."),
  telephone: z
    .string("Indiquez votre numéro de téléphone.")
    .min(1, "Indiquez votre numéro de téléphone.")
    .regex(PHONE_E164_REGEX, "Numéro invalide."),
  email: z.string().trim().min(1, "Indiquez votre email.").pipe(z.email("Email invalide.")),
  /** Optionnel — chiffres uniquement, converti en integer (ou null) en base. */
  participants: z
    .string()
    .trim()
    .regex(/^\d{0,6}$/, "Chiffres uniquement (ex. : 200).")
    .refine((value) => value === "" || Number(value) > 0, "Indiquez un nombre supérieur à 0."),
  entreprise: z.string().trim().max(150, "150 caractères maximum."),
  fonction: z.string().trim().max(150, "150 caractères maximum."),
});

/**
 * Garde serveur : un pack renseigné doit appartenir au secteur choisi
 * (l'UI l'empêche déjà — cette voie ne se prend qu'en soumission forgée).
 */
export const leadSchema = leadObject.superRefine((lead, ctx) => {
  if (lead.pack === "") return;
  const packBelongsToSecteur =
    lead.secteur !== "autre" && getOffer(lead.secteur).packs.some((p) => p.id === lead.pack);
  if (!packBelongsToSecteur) {
    ctx.addIssue({ code: "custom", path: ["pack"], message: "Pack invalide pour ce secteur." });
  }
});

export type Lead = z.infer<typeof leadSchema>;

/**
 * Attribution premier-touchpoint jointe au lead (lib/tracking/attribution.ts).
 * Validée CÔTÉ SERVEUR uniquement — jamais bloquante : invalide = ignorée.
 * Clés inconnues retirées par z.object (strip par défaut).
 */
const attributionValue = z.string().max(200).optional();

export const attributionSchema = z.object({
  utm_source: attributionValue,
  utm_medium: attributionValue,
  utm_campaign: attributionValue,
  utm_content: attributionValue,
  utm_term: attributionValue,
  gclid: attributionValue,
  fbclid: attributionValue,
  ad_id: attributionValue,
  ad_name: attributionValue,
  adset_id: attributionValue,
  adset_name: attributionValue,
  campaign_id: attributionValue,
  campaign_name: attributionValue,
  platform: attributionValue,
  referrer: z.string().max(500).optional(),
});

export type Attribution = z.infer<typeof attributionSchema>;
