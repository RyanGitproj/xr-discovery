/**
 * Point de sortie UNIQUE des events dataLayer (funnel_start, lead_submit…).
 * GTM n'est pas encore chargé (chantier gtm-tracking-setup quand l'ID
 * conteneur existera) : pousser dans window.dataLayer sans GTM est inoffensif
 * et ne pose aucun cookie — les events seront repris tels quels par le
 * conteneur le jour venu. No-op côté serveur.
 */

type DataLayerParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: object[];
  }
}

export function pushDataLayerEvent(event: string, params: DataLayerParams = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}

/** Variante dédupliquée par session (conversions : une seule occurrence). */
export function pushDataLayerEventOnce(
  dedupKey: string,
  event: string,
  params: DataLayerParams = {},
): void {
  if (typeof window === "undefined") return;
  try {
    const key = `dl_once_${dedupKey}`;
    if (sessionStorage.getItem(key) !== null) return;
    sessionStorage.setItem(key, "1");
  } catch {
    // sessionStorage indisponible : on pousse quand même (dédup best-effort).
  }
  pushDataLayerEvent(event, params);
}
