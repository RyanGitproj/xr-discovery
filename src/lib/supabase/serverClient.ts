import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;
let warned = false;

/**
 * Client Supabase serveur — clé secrète (service_role) : elle bypasse la RLS,
 * la table étant deny-all pour tous les autres rôles. Singleton mémoïsé ;
 * l'ABSENCE de configuration n'est pas mémoïsée (les env peuvent être
 * rechargées en dev). Renvoie null si les variables manquent : mode maquette,
 * les appelants dégradent proprement — jamais de crash.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  if (client !== null) return client;

  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (url === undefined || secretKey === undefined) {
    if (!warned) {
      warned = true;
      console.warn(
        "[supabase] SUPABASE_URL / SUPABASE_SECRET_KEY absents — persistance des leads désactivée (mode maquette).",
      );
    }
    return null;
  }

  client = createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
