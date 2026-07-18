"use client";

import { useRef } from "react";
import { cx } from "@/lib/cx";
import { pseudoRandom } from "@/lib/pseudoRandom";
import { useOffscreenPause } from "@/lib/motion/useOffscreenPause";

/* Palette v3 : ambre, rouge, flamme, blanc chaud + une pointe teal rare. */
const COLORS = ["#ffc24d", "#e82818", "#f5431c", "#fff4e8", "#2fbfa8"];

type SparklesProps = {
  /** Hero : 12-16 ; CTA final : 8-10. */
  count?: number;
  className?: string;
};

/**
 * Étincelles qui scintillent (v1.2) — positions et cadences déterministes,
 * scale + opacity uniquement. Statiques à 55 % sous reduced-motion.
 */
export function Sparkles({ count = 14, className }: SparklesProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Scintillement continu : pause hors écran (client assumé — le gain RSC
  // est marginal devant le coût paint mesuré des champs toujours animés).
  useOffscreenPause(ref);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cx("fx-layer", "fx-field", className)}
    >
      {Array.from({ length: count }, (_, i) => {
        const size = 1.5 + pseudoRandom(i, 4) * 2.5;
        const color = COLORS[i % COLORS.length];
        return (
          <span
            key={i}
            className="sparkle"
            style={{
              top: `${(pseudoRandom(i, 0) * 100).toFixed(1)}%`,
              left: `${(pseudoRandom(i, 1) * 100).toFixed(1)}%`,
              width: size,
              height: size,
              background: color,
              boxShadow: `0 0 ${Math.round(6 + size * 2)}px ${color}`,
              "--sparkle-dur": `${(3 + pseudoRandom(i, 2) * 4).toFixed(1)}s`,
              "--sparkle-delay": `${(pseudoRandom(i, 3) * 6).toFixed(1)}s`,
            }}
          />
        );
      })}
    </div>
  );
}
