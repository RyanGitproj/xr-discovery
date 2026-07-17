import { describe, expect, it } from "vitest";
import {
  buildConstellation,
  isPointInPolygon,
  resampleClosedPolygon,
  scatterInsidePolygon,
} from "./constellation";
import { ANTANANARIVO, MADAGASCAR_ASPECT, MADAGASCAR_OUTLINE, type Vec2 } from "./madagascar";

const UNIT_SQUARE: readonly Vec2[] = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
];

describe("MADAGASCAR_OUTLINE", () => {
  it("est un contour dense, borné et sans NaN", () => {
    expect(MADAGASCAR_OUTLINE.length).toBeGreaterThanOrEqual(100);
    for (const p of MADAGASCAR_OUTLINE) {
      expect(Number.isFinite(p.x)).toBe(true);
      expect(Number.isFinite(p.y)).toBe(true);
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(MADAGASCAR_ASPECT);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(1);
    }
  });

  it("a une boîte englobante cohérente avec l'aspect exporté", () => {
    const xMax = Math.max(...MADAGASCAR_OUTLINE.map((p) => p.x));
    const yMax = Math.max(...MADAGASCAR_OUTLINE.map((p) => p.y));
    expect(xMax).toBeCloseTo(MADAGASCAR_ASPECT, 2);
    expect(yMax).toBeCloseTo(1, 2);
  });

  it("contient Antananarivo, quasi au centre de l'île", () => {
    expect(isPointInPolygon(ANTANANARIVO, MADAGASCAR_OUTLINE)).toBe(true);
    expect(ANTANANARIVO.x / MADAGASCAR_ASPECT).toBeGreaterThan(0.53);
    expect(ANTANANARIVO.x / MADAGASCAR_ASPECT).toBeLessThan(0.64);
    expect(ANTANANARIVO.y).toBeGreaterThan(0.45);
    expect(ANTANANARIVO.y).toBeLessThan(0.57);
  });
});

describe("isPointInPolygon", () => {
  it("classe correctement intérieur et extérieur du carré unité", () => {
    expect(isPointInPolygon({ x: 0.5, y: 0.5 }, UNIT_SQUARE)).toBe(true);
    expect(isPointInPolygon({ x: 2, y: 2 }, UNIT_SQUARE)).toBe(false);
    expect(isPointInPolygon({ x: -0.1, y: 0.5 }, UNIT_SQUARE)).toBe(false);
  });

  it("gère les points près d'une arête", () => {
    expect(isPointInPolygon({ x: 0.001, y: 0.5 }, UNIT_SQUARE)).toBe(true);
    expect(isPointInPolygon({ x: 1.001, y: 0.5 }, UNIT_SQUARE)).toBe(false);
  });
});

describe("resampleClosedPolygon", () => {
  it("rend le nombre demandé de points, équidistants sur le périmètre", () => {
    const count = 40;
    const points = resampleClosedPolygon(UNIT_SQUARE, count);
    expect(points).toHaveLength(count);

    const gaps = points.map((p, i) => {
      const next = points[(i + 1) % count];
      return Math.hypot(next.x - p.x, next.y - p.y);
    });
    const mean = gaps.reduce((sum, g) => sum + g, 0) / count;
    const variance = gaps.reduce((sum, g) => sum + (g - mean) ** 2, 0) / count;
    expect(Math.sqrt(variance)).toBeLessThan(mean * 0.05);
  });

  it("reste sur le tracé du polygone (carré : une coordonnée sur un bord)", () => {
    for (const p of resampleClosedPolygon(UNIT_SQUARE, 17)) {
      const onEdge = [p.x, p.y].some((v) => Math.abs(v) < 1e-9 || Math.abs(v - 1) < 1e-9);
      expect(onEdge).toBe(true);
    }
  });
});

describe("scatterInsidePolygon", () => {
  it("rend le nombre demandé de points, tous dans Madagascar", () => {
    const points = scatterInsidePolygon(MADAGASCAR_OUTLINE, 14, 7);
    expect(points).toHaveLength(14);
    for (const p of points) {
      expect(isPointInPolygon(p, MADAGASCAR_OUTLINE)).toBe(true);
    }
  });
});

describe("buildConstellation", () => {
  const options = {
    polygon: MADAGASCAR_OUTLINE,
    contourCount: 64,
    interiorCount: 14,
    interiorReach: 0.16,
  };

  it("est déterministe (SSR-safe)", () => {
    expect(buildConstellation(options)).toEqual(buildConstellation(options));
  });

  it("compte contour + intérieurs, contour en tête", () => {
    const { points, contourCount } = buildConstellation(options);
    expect(contourCount).toBe(64);
    expect(points).toHaveLength(64 + 14);
  });

  it("ouvre les liens par la chaîne fermée du contour", () => {
    const { links } = buildConstellation(options);
    for (let i = 0; i < 64; i += 1) {
      expect(links[i]).toEqual({ a: i, b: (i + 1) % 64 });
    }
  });

  it("ne relie par proximité que les paires avec au moins un point intérieur", () => {
    const { links } = buildConstellation(options);
    expect(links.length).toBeGreaterThan(64);
    for (const link of links.slice(64)) {
      expect(Math.max(link.a, link.b)).toBeGreaterThanOrEqual(64);
    }
  });
});
