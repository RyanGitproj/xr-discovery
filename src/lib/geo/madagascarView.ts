import { MADAGASCAR_ASPECT, type Vec2 } from "./madagascar";

/** Côté du viewBox carré de la scène (MadagascarField, stage du hero). */
export const VIEW = 400;
/** Hauteur de l'île dans le viewBox. */
export const ISLAND_HEIGHT = 360;
/**
 * Bord haut de l'île : légèrement descendue (centrée serait 20) pour dégager
 * Antananarivo sous le casque remonté ; la pointe sud (396 + rayon max ~3)
 * reste dans le viewBox.
 */
export const ISLAND_TOP = 36;

const ISLAND_LEFT = (VIEW - ISLAND_HEIGHT * MADAGASCAR_ASPECT) / 2;

/** Coordonnées île normalisées → viewBox (l'île est centrée en largeur). */
export function toView(p: Vec2): Vec2 {
  return {
    x: ISLAND_LEFT + p.x * ISLAND_HEIGHT,
    y: ISLAND_TOP + p.y * ISLAND_HEIGHT,
  };
}

/**
 * Coordonnées île normalisées → % du stage. Le stage est carré et le SVG le
 * remplit (viewBox carré, `meet`) : % = viewBox / (VIEW/100). Permet de
 * positionner des éléments HTML (ping, apex du faisceau) exactement sur
 * un point de l'île.
 */
export function toViewPct(p: Vec2): Vec2 {
  const v = toView(p);
  return { x: v.x / (VIEW / 100), y: v.y / (VIEW / 100) };
}
