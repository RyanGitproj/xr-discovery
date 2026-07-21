/**
 * Attribution premier-touchpoint : UTM, click-ids (gclid/fbclid) et
 * paramètres d'annonce passés en query string par les campagnes (modèles
 * d'URL Meta/Google : {{ad.id}}, {{campaign.name}}…), plus document.referrer.
 * Capturée UNE fois par session dans sessionStorage (jamais écrasée, le
 * premier touchpoint prime), puis jointe au lead à la soumission (validée
 * côté serveur par attributionSchema).
 */

export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "ad_id",
  "ad_name",
  "adset_id",
  "adset_name",
  "campaign_id",
  "campaign_name",
  "platform",
] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type AttributionData = Partial<Record<AttributionKey | "referrer", string>>;

const STORAGE_KEY = "funnel_attribution";

/** À appeler au premier rendu client. Un atterrissage sans paramètre écrit
    un objet vide : il VERROUILLE le premier touchpoint (organique). */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(STORAGE_KEY) !== null) return;

    const params = new URLSearchParams(window.location.search);
    const data: AttributionData = {};
    for (const key of ATTRIBUTION_KEYS) {
      const value = params.get(key);
      if (value !== null && value !== "") data[key] = value;
    }
    if (document.referrer !== "") data.referrer = document.referrer;

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage indisponible (navigation privée stricte…) : le lead
    // partira sans attribution, ce n'est jamais bloquant.
  }
}

export function readAttribution(): AttributionData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    // Écrit par captureAttribution ; revalidé par le serveur au submit.
    return parsed as AttributionData;
  } catch {
    return null;
  }
}
