-- Leads du funnel XR VR Discovery (landing « Centres commerciaux & retail »).
-- À exécuter dans le SQL editor Supabase.
--
-- Sécurité : RLS activée SANS policy = deny-all pour anon/authenticated.
-- Seules les Server Actions écrivent, via la clé secrète (service_role) —
-- le navigateur ne parle jamais à Supabase.

create table public.funnel_xr_discovery_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Qualification (étape 1 du formulaire)
  type_organisation text not null,
  objectif_principal text not null,
  budget text not null,
  periode text not null,

  -- Contact (étape 2) — telephone au format E.164 (+261…), email obligatoire
  nom text not null,
  telephone text not null,
  email text not null,
  participants integer check (participants > 0),
  entreprise text,
  fonction text,

  -- Suivi commercial (repris de l'ancienne table xr_vr_leads)
  lead_status text not null default 'New',

  -- Attribution premier-touchpoint (query string des campagnes + referrer).
  -- ad_*/adset_*/campaign_*/platform : modèles d'URL Meta/Google ({{ad.id}}…).
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  gclid text,
  fbclid text,
  ad_id text,
  ad_name text,
  adset_id text,
  adset_name text,
  campaign_id text,
  campaign_name text,
  platform text,
  is_organic boolean not null default false
);

alter table public.funnel_xr_discovery_leads enable row level security;

create index funnel_xr_discovery_leads_created_at_idx
  on public.funnel_xr_discovery_leads (created_at desc);

create index funnel_xr_discovery_leads_email_idx
  on public.funnel_xr_discovery_leads (email);
