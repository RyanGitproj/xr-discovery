/**
 * Couleurs cyclées des nœuds lumineux (NeuralField, MadagascarField).
 * Chaudes (fx-*) + un vrai turquoise et un vrai violet : les « points
 * nuages » de la constellation cessent d'être uniformément orange.
 */
export const FX_NODE_COLORS = [
  "var(--color-fx-cyan)",
  "var(--color-accent-cool)",
  "var(--color-fx-pink)",
  "var(--color-accent-cool-2)",
  "var(--color-fx-violet)",
] as const;
