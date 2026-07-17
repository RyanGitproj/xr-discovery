import { describe, expect, it } from "vitest";
import { beamLayout } from "./beamLayout";

describe("beamLayout", () => {
  const apex = { x: 53.9, y: 54.6 };
  const top = { x: 50, width: 38, y: 36 };

  it("la boîte englobe l'apex et le bord haut", () => {
    const b = beamLayout(apex, top);
    expect(b.left).toBeLessThanOrEqual(top.x - top.width / 2);
    expect(b.left + b.width).toBeGreaterThanOrEqual(apex.x);
    expect(b.top).toBe(top.y);
    expect(b.height).toBeCloseTo(apex.y - top.y, 2);
  });

  it("le clip-path est ordonné et borné [0, 100]", () => {
    const b = beamLayout(apex, top);
    const xs = [...b.clipPath.matchAll(/([\d.]+)% (?:0|100)%/g)].map((m) => Number(m[1]));
    expect(xs).toHaveLength(4);
    for (const x of xs) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(100);
    }
    expect(xs[0]).toBeLessThan(xs[1]); // bord haut : gauche < droite
    expect(xs[3]).toBeLessThan(xs[2]); // apex : gauche < droite
  });

  it("élargit la boîte quand l'apex sort de l'empan haut", () => {
    const wide = beamLayout({ x: 80, y: 60 }, top, 3);
    expect(wide.left + wide.width).toBeCloseTo(80 + 1.5, 2);
    expect(wide.clipPath).toContain("100% 100%");
  });
});
