"use client";

import { useSyncExternalStore } from "react";
import type { OfferId } from "@/config/offers";

/**
 * Sélection « Choisir ce pack » partagée entre la section Offres et le
 * formulaire (présélection secteur + pack). Store module-scope minimal :
 * les deux seuls consommateurs sont des client components montés en
 * permanence sur la page, donc pas besoin de context ni de lib d'état.
 * null tant qu'aucun CTA de pack n'a été cliqué (formulaire vierge).
 */

export type OfferSelection = {
  secteur: OfferId;
  pack: string;
};

let selection: OfferSelection | null = null;
const listeners = new Set<() => void>();

export function chooseOfferPack(secteur: OfferId, pack: string): void {
  selection = { secteur, pack };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => selection;
const getServerSnapshot = () => null;

export function useOfferSelection(): OfferSelection | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
