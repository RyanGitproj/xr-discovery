import {
  BUDGET_LABELS,
  DECIDEUR_LABELS,
  DUREE_LABELS,
  FIELD_LABELS,
  OBJECTIF_LABELS,
  PARTICIPANTS_LABELS,
  PROJECT_LABELS,
  PUBLIC_LABELS,
} from "@/config/leadForm";
import type { Lead } from "@/lib/validations/lead";

const INTRO = "Bonjour XR Technology ! Je souhaite un devis pour une animation VR.";

/**
 * Récapitulatif lisible du lead — partagé entre l'email et WhatsApp.
 * Accepte un lead PARTIEL (canal WhatsApp avant validation complète) :
 * seules les réponses effectivement remplies sont listées.
 */
export function leadRecapLines(lead: Partial<Lead>): string[] {
  const entries: Array<[string, string | undefined]> = [
    [FIELD_LABELS.projet, lead.projet === undefined ? undefined : PROJECT_LABELS[lead.projet]],
    [FIELD_LABELS.public, lead.public === undefined ? undefined : PUBLIC_LABELS[lead.public]],
    [
      FIELD_LABELS.participants,
      lead.participants === undefined ? undefined : PARTICIPANTS_LABELS[lead.participants],
    ],
    [FIELD_LABELS.date, lead.date],
    [FIELD_LABELS.lieu, lead.lieu],
    [FIELD_LABELS.duree, lead.duree === undefined ? undefined : DUREE_LABELS[lead.duree]],
    [
      FIELD_LABELS.objectif,
      lead.objectif === undefined ? undefined : OBJECTIF_LABELS[lead.objectif],
    ],
    [FIELD_LABELS.budget, lead.budget === undefined ? undefined : BUDGET_LABELS[lead.budget]],
    [
      FIELD_LABELS.decideur,
      lead.decideur === undefined ? undefined : DECIDEUR_LABELS[lead.decideur],
    ],
    [FIELD_LABELS.nom, lead.nom],
    [FIELD_LABELS.telephone, lead.telephone],
    ["Email", lead.email],
  ];
  return entries
    .filter((entry): entry is [string, string] => entry[1] !== undefined && entry[1].trim() !== "")
    .map(([label, value]) => `${label} : ${value}`);
}

/** Corps de l'email de notification interne (lead validé complet). */
export function leadEmailText(lead: Lead): string {
  return ["Nouveau lead XR VR Discovery :", "", ...leadRecapLines(lead)].join("\n");
}

/**
 * Message WhatsApp pré-rempli : récap de TOUTES les réponses déjà saisies —
 * même partielles, rien ne se perd en changeant de canal.
 */
export function leadWhatsAppText(lead: Partial<Lead>): string {
  const lines = leadRecapLines(lead);
  if (lines.length === 0) return INTRO;
  return [INTRO, "", ...lines].join("\n");
}
