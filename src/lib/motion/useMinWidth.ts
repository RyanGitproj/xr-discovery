"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * true/false une fois hydraté ; `null` côté serveur ET pendant l'hydratation
 * (getServerSnapshot). Le temps que la valeur soit connue, l'appelant rend
 * les deux variantes et laisse le CSS trancher : aucun mismatch React, puis
 * la variante inutile est démontée (son coût JS/scroll disparaît).
 */
export function useMinWidth(px: number): boolean | null {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(`(min-width: ${px}px)`);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [px],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(`(min-width: ${px}px)`).matches,
    () => null,
  );
}
