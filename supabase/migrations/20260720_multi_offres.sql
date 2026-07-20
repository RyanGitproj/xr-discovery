-- Multi-offres (2026-07-20) : le formulaire enregistre désormais le secteur
-- (8 offres + 'autre') et le pack envisagé, à la place de type_organisation.
-- À exécuter dans le SQL editor Supabase AVANT de déployer le code — le
-- nouveau code n'écrit plus type_organisation.

alter table public.funnel_xr_discovery_leads
  add column if not exists secteur text,
  add column if not exists pack text;

-- Legacy : conservée pour les leads existants, plus jamais écrite.
alter table public.funnel_xr_discovery_leads
  alter column type_organisation drop not null;
