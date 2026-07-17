import type { Vec2 } from "@/lib/geo/madagascar";

export type BeamTop = {
  /** Centre du bord haut, en % du conteneur. */
  x: number;
  /** Largeur du bord haut, en % du conteneur. */
  width: number;
  /** Ordonnée du bord haut, en % du conteneur. */
  y: number;
};

export type BeamLayout = {
  left: number;
  top: number;
  width: number;
  height: number;
  clipPath: string;
};

const round = (v: number) => Math.round(v * 100) / 100;

/**
 * Boîte et clip-path d'un cône de projection : pointe en bas (apex, largeur
 * `apexWidth`), bord haut large. Entrées et boîte en % du conteneur
 * positionné ; clip-path en % de la boîte. Arrondi 2 décimales — déterministe,
 * aucun mismatch SSR.
 */
export function beamLayout(apex: Vec2, top: BeamTop, apexWidth = 3): BeamLayout {
  const left = Math.min(top.x - top.width / 2, apex.x - apexWidth / 2);
  const right = Math.max(top.x + top.width / 2, apex.x + apexWidth / 2);
  const width = right - left;
  const height = apex.y - top.y;

  const toBoxX = (x: number) => round(((x - left) / width) * 100);
  const points = [
    `${toBoxX(top.x - top.width / 2)}% 0%`,
    `${toBoxX(top.x + top.width / 2)}% 0%`,
    `${toBoxX(apex.x + apexWidth / 2)}% 100%`,
    `${toBoxX(apex.x - apexWidth / 2)}% 100%`,
  ];

  return {
    left: round(left),
    top: round(top.y),
    width: round(width),
    height: round(height),
    clipPath: `polygon(${points.join(", ")})`,
  };
}
