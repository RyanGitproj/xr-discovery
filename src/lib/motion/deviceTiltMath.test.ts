import { describe, expect, it } from "vitest";
import {
  EMPTY_TILT_SUM,
  TILT_CALIBRATION_SAMPLES,
  TILT_DEADZONE_DEG,
  addTiltSample,
  normalizeTilt,
  tiltNeutral,
} from "./deviceTiltMath";

describe("normalizeTilt", () => {
  it("deadzone : immobile autour du neutre", () => {
    expect(normalizeTilt(0, 0)).toBe(0);
    expect(normalizeTilt(TILT_DEADZONE_DEG, 0)).toBe(0);
    expect(normalizeTilt(-TILT_DEADZONE_DEG, 0)).toBe(0);
  });

  it("continu à la frontière de la deadzone", () => {
    expect(normalizeTilt(TILT_DEADZONE_DEG + 0.1, 0)).toBeCloseTo(0.1 / 16, 4);
  });

  it("clamp à ±1 au-delà de maxDeg", () => {
    expect(normalizeTilt(45, 0, 18)).toBe(1);
    expect(normalizeTilt(-45, 0, 18)).toBe(-1);
  });

  it("relatif au neutre calibré (téléphone tenu incliné)", () => {
    expect(normalizeTilt(48, 30, 18)).toBe(1);
    expect(normalizeTilt(30, 30, 18)).toBe(0);
  });

  it("signe : incliner à droite (gamma +) → positif", () => {
    expect(normalizeTilt(10, 0, 18)).toBeGreaterThan(0);
    expect(normalizeTilt(-10, 0, 18)).toBeLessThan(0);
  });
});

describe("calibration", () => {
  it("null tant que l'échantillon est insuffisant", () => {
    let sum = EMPTY_TILT_SUM;
    for (let i = 0; i < TILT_CALIBRATION_SAMPLES - 1; i += 1) {
      sum = addTiltSample(sum, 40, -5);
    }
    expect(tiltNeutral(sum)).toBeNull();
  });

  it("le neutre est la moyenne des lectures", () => {
    let sum = EMPTY_TILT_SUM;
    for (let i = 0; i < TILT_CALIBRATION_SAMPLES; i += 1) {
      sum = addTiltSample(sum, i % 2 === 0 ? 42 : 38, -5);
    }
    expect(tiltNeutral(sum)).toEqual({ beta: 40, gamma: -5 });
  });
});
