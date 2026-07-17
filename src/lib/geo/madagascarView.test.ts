import { describe, expect, it } from "vitest";
import { ANTANANARIVO, MADAGASCAR_ASPECT } from "./madagascar";
import { ISLAND_HEIGHT, ISLAND_TOP, toView, toViewPct, VIEW } from "./madagascarView";

describe("toView", () => {
  it("centre l'île en largeur", () => {
    const left = toView({ x: 0, y: 0 }).x;
    const right = toView({ x: MADAGASCAR_ASPECT, y: 0 }).x;
    expect(left).toBeCloseTo(VIEW - right, 6);
  });

  it("ne clippe pas la pointe sud (rayon max ~3 compris)", () => {
    expect(toView({ x: 0, y: 1 }).y).toBe(ISLAND_TOP + ISLAND_HEIGHT);
    expect(ISLAND_TOP + ISLAND_HEIGHT + 3).toBeLessThanOrEqual(VIEW);
  });
});

describe("toViewPct", () => {
  it("convertit le viewBox en % du stage (facteur VIEW/100)", () => {
    const p = { x: 0.25, y: 0.5 };
    const v = toView(p);
    const pct = toViewPct(p);
    expect(pct.x).toBeCloseTo(v.x / 4, 6);
    expect(pct.y).toBeCloseTo(v.y / 4, 6);
  });

  it("place Antananarivo sous le casque remonté, dans le stage", () => {
    const tana = toViewPct(ANTANANARIVO);
    expect(tana.x).toBeGreaterThan(50);
    expect(tana.x).toBeLessThan(60);
    expect(tana.y).toBeGreaterThan(50);
    expect(tana.y).toBeLessThan(60);
  });
});
