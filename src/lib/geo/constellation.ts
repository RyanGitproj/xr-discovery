import type { Vec2 } from "./madagascar";

/** Lien entre deux points, par indices dans `Constellation.points`. */
export type ConstellationLink = { readonly a: number; readonly b: number };

export type Constellation = {
  /** Points de contour d'abord (indices < contourCount), puis intérieurs. */
  readonly points: readonly Vec2[];
  readonly contourCount: number;
  /** Chaîne fermée du contour d'abord, puis liens de proximité intérieurs. */
  readonly links: readonly ConstellationLink[];
};

export type ConstellationOptions = {
  /** Polygone fermé (dernier sommet implicitement relié au premier). */
  polygon: readonly Vec2[];
  contourCount: number;
  interiorCount: number;
  /** Distance max de connexion des points intérieurs (unités du polygone). */
  interiorReach: number;
  salt?: number;
};

/**
 * Hachage entier → [0, 1) (mélange type mulberry32), déterministe donc
 * SSR-safe. `pseudoRandom` (suite de Weyl dorée) est inutilisable pour un
 * semis 2D : selon le salt son pas est quasi entier et l'axe ne bouge plus
 * (les points s'agglutinent en paquet).
 */
function hash01(index: number, salt: number): number {
  let h = Math.imul(index + 1, 0x9e3779b1) ^ Math.imul(salt + 1, 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 15), 0x735a2d97);
  h = Math.imul(h ^ (h >>> 13), 0xcaf649a9);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

type Segment = { from: Vec2; to: Vec2; length: number };

function toSegments(polygon: readonly Vec2[]): Segment[] {
  return polygon.map((from, i) => {
    const to = polygon[(i + 1) % polygon.length];
    return { from, to, length: Math.hypot(to.x - from.x, to.y - from.y) };
  });
}

/** `count` points équidistants (abscisse curviligne) le long du polygone fermé. */
export function resampleClosedPolygon(polygon: readonly Vec2[], count: number): Vec2[] {
  const segments = toSegments(polygon);
  const perimeter = segments.reduce((sum, s) => sum + s.length, 0);
  const step = perimeter / count;

  const points: Vec2[] = [];
  let segIndex = 0;
  let traveled = 0;
  for (let i = 0; i < count; i += 1) {
    const target = i * step;
    while (traveled + segments[segIndex].length < target) {
      traveled += segments[segIndex].length;
      segIndex += 1;
    }
    const { from, to, length } = segments[segIndex];
    const t = length === 0 ? 0 : (target - traveled) / length;
    points.push({ x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t });
  }
  return points;
}

/** Test d'appartenance par ray casting (parité des croisements). */
export function isPointInPolygon(point: Vec2, polygon: readonly Vec2[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const a = polygon[i];
    const b = polygon[j];
    if (a.y > point.y === b.y > point.y) continue;
    const xAtY = a.x + ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y);
    if (point.x < xAtY) inside = !inside;
  }
  return inside;
}

/**
 * `count` points intérieurs par rejection sampling déterministe (candidats
 * hachés dans la bbox, acceptés s'ils tombent dans le polygone). Garde-fou
 * `count * 50` essais : la fonction peut donc en rendre moins sur un polygone
 * très creux.
 */
export function scatterInsidePolygon(
  polygon: readonly Vec2[],
  count: number,
  salt: number,
): Vec2[] {
  const xs = polygon.map((p) => p.x);
  const ys = polygon.map((p) => p.y);
  const xMin = Math.min(...xs);
  const yMin = Math.min(...ys);
  const width = Math.max(...xs) - xMin;
  const height = Math.max(...ys) - yMin;

  const points: Vec2[] = [];
  const maxAttempts = count * 50;
  for (let attempt = 0; attempt < maxAttempts && points.length < count; attempt += 1) {
    const candidate = {
      x: xMin + hash01(attempt * 2, salt) * width,
      y: yMin + hash01(attempt * 2 + 1, salt) * height,
    };
    if (isPointInPolygon(candidate, polygon)) points.push(candidate);
  }
  return points;
}

/**
 * Constellation « carte » : contour rééchantillonné relié en chaîne fermée
 * (la silhouette est garantie, aucune corde traversante), points intérieurs
 * raccrochés par proximité. Déterministe, donc aucun mismatch SSR.
 */
export function buildConstellation(options: ConstellationOptions): Constellation {
  const { polygon, contourCount, interiorCount, interiorReach, salt = 7 } = options;
  const contour = resampleClosedPolygon(polygon, contourCount);
  const points = [...contour, ...scatterInsidePolygon(polygon, interiorCount, salt)];

  const links: ConstellationLink[] = contour.map((_, i) => ({
    a: i,
    b: (i + 1) % contourCount,
  }));
  for (let i = 0; i < points.length; i += 1) {
    for (let j = Math.max(i + 1, contourCount); j < points.length; j += 1) {
      const distance = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
      if (distance < interiorReach) links.push({ a: i, b: j });
    }
  }
  return { points, contourCount, links };
}
