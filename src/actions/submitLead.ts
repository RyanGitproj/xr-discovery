"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { leadEmailText } from "@/lib/format/leadMessage";
import { leadSchema, type Lead } from "@/lib/validations/lead";

export type SubmitLeadResult = { ok: false; error: string };

/**
 * Réception du formulaire de qualification. Validation serveur avec LE MÊME
 * schéma Zod que le client, livraison email, cookie httpOnly 30 min pour la
 * page /merci, puis redirection.
 */
export async function submitLead(input: unknown): Promise<SubmitLeadResult | undefined> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Certaines réponses sont invalides — vérifiez le formulaire." };
  }

  try {
    await deliverLead(parsed.data);
  } catch (error) {
    // Frontière externe (API email) : un échec d'envoi ne doit pas bloquer
    // le visiteur — le lead est tracé côté serveur, voir TODO.md.
    console.error("[lead] échec de livraison email :", error, parsed.data);
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

async function deliverLead(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_EMAIL_FROM;
  const to = process.env.LEAD_EMAIL_TO;

  if (apiKey === undefined || from === undefined || to === undefined) {
    // Maquette : livraison email non configurée (voir TODO.md).
    console.info("[lead] email non configuré — lead reçu :\n" + leadEmailText(lead));
    return;
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to,
    subject: `Nouveau lead XR VR Discovery — ${lead.nom}`,
    text: leadEmailText(lead),
  });
}
