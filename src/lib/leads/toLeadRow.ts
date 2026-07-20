import type { LeadRow } from "@/lib/supabase/leads";
import type { Attribution, Lead } from "@/lib/validations/lead";

const orNull = (value: string | undefined): string | null =>
  value === undefined || value === "" ? null : value;

/**
 * Mapping PUR formulaire + attribution → ligne funnel_xr_discovery_leads
 * (camelCase → snake_case, optionnels vides → null). `is_organic` = aucun
 * marqueur payant (utm_source, click-ids, ad_id) sur le premier touchpoint.
 */
export function toLeadRow(lead: Lead, attribution: Attribution | null): LeadRow {
  const attr = attribution ?? {};
  const utmSource = orNull(attr.utm_source);
  const gclid = orNull(attr.gclid);
  const fbclid = orNull(attr.fbclid);
  const adId = orNull(attr.ad_id);

  return {
    secteur: lead.secteur,
    pack: orNull(lead.pack),
    objectif_principal: lead.objectif,
    budget: lead.budget,
    periode: lead.periode,
    nom: lead.nom,
    telephone: lead.telephone,
    email: lead.email,
    participants: lead.participants === "" ? null : Number(lead.participants),
    entreprise: orNull(lead.entreprise),
    fonction: orNull(lead.fonction),
    utm_source: utmSource,
    utm_medium: orNull(attr.utm_medium),
    utm_campaign: orNull(attr.utm_campaign),
    utm_content: orNull(attr.utm_content),
    utm_term: orNull(attr.utm_term),
    referrer: orNull(attr.referrer),
    gclid,
    fbclid,
    ad_id: adId,
    ad_name: orNull(attr.ad_name),
    adset_id: orNull(attr.adset_id),
    adset_name: orNull(attr.adset_name),
    campaign_id: orNull(attr.campaign_id),
    campaign_name: orNull(attr.campaign_name),
    platform: orNull(attr.platform),
    is_organic: utmSource === null && gclid === null && fbclid === null && adId === null,
  };
}
