import { describe, expect, it } from "vitest";
import {
  FLOW_RANGE_MAX,
  FLOW_RANGE_MIN,
  INSET_RANGE_MAX,
  clampDepth,
  flowKeyframes,
  insetKeyframes,
  insetScale,
} from "./parallaxMath";

describe("clampDepth", () => {
  it("borne la profondeur à [-1, 1]", () => {
    expect(clampDepth(-2)).toBe(-1);
    expect(clampDepth(2)).toBe(1);
    expect(clampDepth(0.4)).toBe(0.4);
  });
});

describe("flowKeyframes", () => {
  it("neutre 0.5 : symétrique, nul à mi-traversée", () => {
    expect(flowKeyframes(0.5, 96)).toEqual([48, -48]);
    expect(flowKeyframes(-0.5, 96)).toEqual([-48, 48]);
  });

  it("un fond (depth < 0) traîne : son y local augmente avec la progression", () => {
    const [from, to] = flowKeyframes(-0.35, 56);
    expect(from).toBeLessThan(to);
  });

  it("un avant-plan (depth > 0) devance : son y local diminue", () => {
    const [from, to] = flowKeyframes(0.55, 56);
    expect(from).toBeGreaterThan(to);
  });

  it("neutre 0 (scène épinglée en haut) : aucun décalage au chargement", () => {
    const [from, to] = flowKeyframes(-0.35, 56, 0);
    expect(from === 0).toBe(true);
    expect(to).toBeCloseTo(39.2, 6);
    expect(flowKeyframes(0.55, 56, 0)[0] === 0).toBe(true);
  });

  it("clampe l'amplitude et la profondeur", () => {
    expect(flowKeyframes(1, 500)).toEqual([FLOW_RANGE_MAX, -FLOW_RANGE_MAX]);
    expect(flowKeyframes(2, FLOW_RANGE_MIN)).toEqual([FLOW_RANGE_MIN, -FLOW_RANGE_MIN]);
  });
});

describe("insetKeyframes / insetScale", () => {
  it("keyframes en % bornés par la plage inset", () => {
    expect(insetKeyframes(-0.25, 8)).toEqual([-2, 2]);
    expect(insetKeyframes(1, 50)).toEqual([INSET_RANGE_MAX, -INSET_RANGE_MAX]);
  });

  it("la sur-échelle couvre exactement le débattement maximal", () => {
    const depth = -0.25;
    const range = 8;
    const [from, to] = insetKeyframes(depth, range);
    const maxTravelPct = Math.max(Math.abs(from), Math.abs(to));
    const coveragePerSidePct = ((insetScale(depth, range) - 1) / 2) * 100;
    expect(coveragePerSidePct).toBeGreaterThanOrEqual(maxTravelPct);
  });

  it("valeurs du plan : Audience -0.12 ≈ 1.02, Argument -0.25 = 1.04", () => {
    expect(insetScale(-0.12, 8)).toBeCloseTo(1.0192, 4);
    expect(insetScale(-0.25, 8)).toBeCloseTo(1.04, 4);
  });

  it("depth 0 : aucune sur-échelle", () => {
    expect(insetScale(0, 8)).toBe(1);
  });
});
