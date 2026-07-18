"use client";

import { useEffect } from "react";
import { pushDataLayerEventOnce } from "@/lib/tracking/gtm";

/**
 * Conversion `lead_submit`, poussée sur /merci — la page est gated par le
 * cookie httpOnly de soumission, donc jamais de faux positif par accès
 * direct. Dédupliquée par session (un reload de /merci ne recompte pas).
 */
export function LeadConversionTracker() {
  useEffect(() => {
    pushDataLayerEventOnce("lead_submit", "lead_submit");
  }, []);
  return null;
}
