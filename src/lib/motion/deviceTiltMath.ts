/**
 * Moteur pur du gyroscope (Immersion v2.1) : normalisation et calibration
 * testables sans DOM — useDeviceTilt ne fait qu'appliquer ces fonctions aux
 * événements deviceorientation.
 */

export const TILT_MAX_DEG_DEFAULT = 18;
/** Un téléphone tenu en main tremble : ±2° autour du neutre = immobile. */
export const TILT_DEADZONE_DEG = 2;
/** Le neutre est la moyenne des premières lectures — un téléphone se tient
 * incliné, pas à plat. */
export const TILT_CALIBRATION_SAMPLES = 20;

/**
 * Angle → valeur normalisée -1..1 relative au neutre calibré : deadzone ±2°
 * (retour 0, continu à la frontière), clamp ±maxDeg.
 */
export function normalizeTilt(
  deg: number,
  neutralDeg: number,
  maxDeg: number = TILT_MAX_DEG_DEFAULT,
): number {
  const delta = deg - neutralDeg;
  const magnitude = Math.abs(delta);
  if (magnitude <= TILT_DEADZONE_DEG) return 0;
  const usable = maxDeg - TILT_DEADZONE_DEG;
  const effective = Math.min(magnitude - TILT_DEADZONE_DEG, usable);
  return (Math.sign(delta) * effective) / usable;
}

export type TiltSampleSum = {
  count: number;
  beta: number;
  gamma: number;
};

export const EMPTY_TILT_SUM: TiltSampleSum = { count: 0, beta: 0, gamma: 0 };

export function addTiltSample(sum: TiltSampleSum, beta: number, gamma: number): TiltSampleSum {
  return { count: sum.count + 1, beta: sum.beta + beta, gamma: sum.gamma + gamma };
}

/** Neutre calibré, ou null tant que l'échantillon est insuffisant. */
export function tiltNeutral(sum: TiltSampleSum): { beta: number; gamma: number } | null {
  if (sum.count < TILT_CALIBRATION_SAMPLES) return null;
  return { beta: sum.beta / sum.count, gamma: sum.gamma / sum.count };
}
