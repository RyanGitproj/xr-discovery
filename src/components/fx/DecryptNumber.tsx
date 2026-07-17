"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cx } from "@/lib/cx";
import { formatAriary, formatNumberFr } from "@/lib/format/ariary";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";

/** Durée totale du déchiffrement. */
const DURATION_MS = 620;
/** Cadence de rebrouillage des chiffres non résolus. */
const TICK_MS = 40;
/** Brouillage intégral avant le début de la résolution gauche → droite. */
const HOLD_MS = 140;

type DecryptNumberProps = {
  value: number;
  /** « ar » : prix en ariary (« 1 600 000 Ar ») ; « none » : nombre nu fr-FR. */
  unit?: "ar" | "none";
  className?: string;
};

/**
 * Révélation « déchiffrement » (Famille C, focal, once) : les chiffres
 * apparaissent brouillés puis se résolvent de gauche à droite vers la
 * valeur. Contrairement à un compteur croissant, aucun montant intermédiaire
 * n'est jamais affiché — pas d'effet « le prix grimpe ». Seuls les chiffres
 * sont brouillés (par d'autres chiffres, en tabular-nums) : séparateurs et
 * unité restent stables, zéro décalage de layout. SSR, lecteurs d'écran et
 * reduced-motion : valeur finale directe.
 */
export function DecryptNumber({ value, unit = "none", className }: DecryptNumberProps) {
  const format = unit === "ar" ? formatAriary : formatNumberFr;
  const finalText = format(value);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotionPref();
  const [display, setDisplay] = useState(finalText);

  useEffect(() => {
    if (!inView || reduce) return;
    const digitIndices = [...finalText].flatMap((ch, i) => (/\d/.test(ch) ? [i] : []));
    const start = performance.now();
    const timer = setInterval(() => {
      const elapsed = performance.now() - start;
      if (elapsed >= DURATION_MS) {
        clearInterval(timer);
        setDisplay(finalText);
        return;
      }
      const progress = Math.max(0, (elapsed - HOLD_MS) / (DURATION_MS - HOLD_MS));
      const locked = Math.floor(progress * digitIndices.length);
      const chars = [...finalText];
      digitIndices.forEach((pos, n) => {
        if (n >= locked) chars[pos] = String(Math.floor(Math.random() * 10));
      });
      setDisplay(chars.join(""));
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [inView, reduce, finalText]);

  if (reduce) {
    return <span className={cx("tabular", className)}>{finalText}</span>;
  }

  // Lecteurs d'écran : valeur finale stable ; le brouillage est décoratif.
  return (
    <span ref={ref} className={cx("tabular", className)}>
      <span className="sr-only">{finalText}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
