const GOLDEN = 0.618033988749895;

/**
 * Pseudo-aléatoire déterministe [0, 1) : stable entre serveur et client
 * (aucun mismatch d'hydratation). Utilisé par les primitives à dispersion
 * (Meteors, Sparkles, NeuralField).
 */
export function pseudoRandom(index: number, salt: number): number {
  const value = (index + 1) * GOLDEN * (salt + 1.7);
  return value - Math.floor(value);
}
