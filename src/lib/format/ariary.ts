const NARROW_NBSP = String.fromCharCode(0x202f);
const NBSP = String.fromCharCode(0x00a0);

/**
 * Groupe les milliers à la française avec une espace fine insécable :
 * 1600000 → « 1 600 000 ». Déterministe (indépendant de la locale ICU).
 */
export function formatNumberFr(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  const digits = Math.abs(rounded).toString();
  const groups: string[] = [];
  for (let end = digits.length; end > 0; end -= 3) {
    groups.unshift(digits.slice(Math.max(0, end - 3), end));
  }
  return sign + groups.join(NARROW_NBSP);
}

/** Formate un montant en ariary : « 1 600 000 Ar » (espace insécable avant Ar). */
export function formatAriary(amount: number): string {
  return `${formatNumberFr(amount)}${NBSP}Ar`;
}
