"use client";

import { useRef } from "react";
import { cx } from "@/lib/cx";
import { pseudoRandom } from "@/lib/pseudoRandom";
import { useOffscreenPause } from "@/lib/motion/useOffscreenPause";

/* Braises : chaud uniquement (la pointe teal reste aux Sparkles). */
const COLORS = ["#ffc24d", "#f5661e", "#f5431c", "#e82818"];

type EmbersProps = {
  /** Avant-plan de scène : ~34 ; nappe d'ambiance : ~20. */
  count?: number;
  className?: string;
};

/**
 * Braises montantes (v3) : points incandescents qui s'élèvent en scintillant
 * et dérivent latéralement — remplace les éclats bokeh froids de la scène de
 * plongée. Positions/durées déterministes (pseudoRandom, zéro mismatch SSR),
 * transform + opacity uniquement, pause hors écran (useOffscreenPause).
 * Sous prefers-reduced-motion : braises figées discrètes (fx-neon.css).
 */
export function Embers({ count = 30, className }: EmbersProps) {
  const ref = useRef<HTMLDivElement>(null);
  useOffscreenPause(ref);

  return (
    <div ref={ref} aria-hidden="true" className={cx("fx-layer", "fx-field", className)}>
      {Array.from({ length: count }, (_, i) => {
        const size = 2.5 + pseudoRandom(i, 4) * 4;
        const color = COLORS[i % COLORS.length];
        const drift = ((pseudoRandom(i, 3) - 0.5) * 52).toFixed(0);
        return (
          <span
            key={i}
            className="ember"
            style={{
              left: `${(pseudoRandom(i, 0) * 100).toFixed(1)}%`,
              top: `${(96 + pseudoRandom(i, 5) * 12).toFixed(1)}%`,
              width: size,
              height: size,
              background: color,
              boxShadow: `0 0 ${Math.round(8 + size * 3)}px ${color}`,
              "--ember-dur": `${(9 + pseudoRandom(i, 2) * 7).toFixed(1)}s`,
              "--ember-delay": `${(pseudoRandom(i, 1) * 12).toFixed(1)}s`,
              "--ember-drift": `${drift}px`,
            }}
          />
        );
      })}
    </div>
  );
}
