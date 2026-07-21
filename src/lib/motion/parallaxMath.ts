/**
 * Moteur pur du système parallax (Immersion v2.1) : bornes, clamps et
 * keyframes vivent ici pour être testés sans DOM ; ParallaxLayer ne fait
 * qu'appliquer ces valeurs à des MotionValues.
 *
 * Convention de profondeur : depth ∈ [-1, 1]. Négatif = lointain (le calque
 * traîne derrière le flux de scroll), 0 = plan du contenu (immobile),
 * positif = avant-plan (le calque devance le flux).
 */

export const DEPTH_MIN = -1;
export const DEPTH_MAX = 1;

/** Mode flow : translation en px. */
export const FLOW_RANGE_DEFAULT = 96;
export const FLOW_RANGE_MIN = 24;
export const FLOW_RANGE_MAX = 160;

/** Mode inset : translation en % de la hauteur du calque, dans un cadre
 * overflow:hidden. Plage courte : l'image glisse, elle ne voyage pas. */
export const INSET_RANGE_DEFAULT = 8;
export const INSET_RANGE_MIN = 4;
export const INSET_RANGE_MAX = 10;

/**
 * Progression où tous les calques sont alignés (déplacement nul) :
 * 0.5 = scène centrée dans le viewport (défaut : l'utilisateur voit la
 * composition exacte du design au moment où il la regarde) ; 0 = scène déjà
 * en place au chargement (hero épinglé en haut : aucun décalage au premier
 * rendu, LCP intact).
 */
export type ParallaxNeutral = 0 | 0.5;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clampDepth(depth: number): number {
  return clamp(depth, DEPTH_MIN, DEPTH_MAX);
}

export function clampFlowRange(range: number): number {
  return clamp(range, FLOW_RANGE_MIN, FLOW_RANGE_MAX);
}

export function clampInsetRange(range: number): number {
  return clamp(range, INSET_RANGE_MIN, INSET_RANGE_MAX);
}

/** Déplacement nul au point neutre : y(p) = (neutral − p) × 2 × depth × range. */
function keyframes(depth: number, range: number, neutral: ParallaxNeutral): [number, number] {
  const d = clampDepth(depth);
  return [2 * neutral * d * range, 2 * (neutral - 1) * d * range];
}

/** Keyframes [progress 0, progress 1] du mode flow, en px. */
export function flowKeyframes(
  depth: number,
  range: number = FLOW_RANGE_DEFAULT,
  neutral: ParallaxNeutral = 0.5,
): [number, number] {
  return keyframes(depth, clampFlowRange(range), neutral);
}

/** Keyframes [progress 0, progress 1] du mode inset, en % de la hauteur. */
export function insetKeyframes(
  depth: number,
  rangePct: number = INSET_RANGE_DEFAULT,
  neutral: ParallaxNeutral = 0.5,
): [number, number] {
  return keyframes(depth, clampInsetRange(rangePct), neutral);
}

/**
 * Sur-échelle du mode inset : le débattement max est |depth| × range % de la
 * hauteur ; l'échelle ajoute exactement ce débord de chaque côté, si bien
 * que les bords de l'image ne se découvrent jamais dans leur cadre
 * overflow:hidden.
 */
export function insetScale(depth: number, rangePct: number = INSET_RANGE_DEFAULT): number {
  return 1 + (2 * Math.abs(clampDepth(depth)) * clampInsetRange(rangePct)) / 100;
}
