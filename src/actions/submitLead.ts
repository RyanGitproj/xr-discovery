"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { toLeadRow } from "@/lib/leads/toLeadRow";
import { insertLead } from "@/lib/supabase/leads";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { attributionSchema, leadSchema } from "@/lib/validations/lead";

export type SubmitLeadResult = { ok: false; error: string };

/**
 * Réception du formulaire. Validation serveur avec LE MÊME schéma Zod que le
 * client, persistance Supabase (funnel_xr_discovery_leads, service_role),
 * cookie httpOnly 30 min pour /merci, puis redirection. L'attribution
 * invalide est ignorée (jamais bloquante) ; sans configuration Supabase le
 * lead est loggé (mode maquette) ; un insert REFUSÉ remonte au visiteur —
 * on ne perd pas un lead en silence.
 */
export async function submitLead(
  input: unknown,
  attributionInput: unknown,
): Promise<SubmitLeadResult | undefined> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Certaines réponses sont invalides — vérifiez le formulaire." };
  }

  const attribution = attributionSchema.safeParse(attributionInput);
  const row = toLeadRow(parsed.data, attribution.success ? attribution.data : null);

  const supabase = getSupabaseServerClient();
  if (supabase === null) {
    // Maquette : persistance non configurée (voir TODO.md) — lead loggé.
    console.info("[lead] Supabase non configuré — lead reçu :", row);
  } else {
    const inserted = await insertLead(supabase, row);
    if (!inserted) {
      return {
        ok: false,
        error: "Impossible d'enregistrer votre demande — réessayez dans un instant.",
      };
    }
  }

  const cookieStore = await cookies();
  cookieStore.set("xr_lead", "1", {
    httpOnly: true,
    maxAge: 60 * 30,
    sameSite: "lax",
    path: "/",
  });
  redirect("/merci");
}
