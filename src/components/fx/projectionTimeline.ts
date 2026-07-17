/**
 * Chronologie de la scène de projection du hero. Module sans "use client" :
 * importable à la fois par les primitives client (MadagascarField) et par le
 * Hero (Server Component).
 */

/** Fin de la formation de l'île : stagger max 0,5 s + converge 1,2 s. */
export const MADA_FORM_END_S = 1.7;

/** Départs (en secondes après le chargement) de la séquence de projection. */
export const PROJECTION_TIMELINE = {
  /** Le point d'Antananarivo s'allume dès que l'île est formée. */
  ping: MADA_FORM_END_S,
  /** Le faisceau jaillit du point. */
  beam: MADA_FORM_END_S + 0.2,
  /** Le casque holographique se matérialise au sommet du faisceau. */
  headset: MADA_FORM_END_S + 0.55,
} as const;
