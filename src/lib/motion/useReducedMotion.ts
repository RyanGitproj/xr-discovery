"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * true si l'utilisateur préfère un mouvement réduit. `false` côté serveur ET
 * pendant l'hydratation (getServerSnapshot), puis bascule au premier commit :
 * aucun mismatch React même quand la structure du DOM en dépend.
 */
export function useReducedMotionPref(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
