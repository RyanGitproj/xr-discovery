"use client";

import { useId, useRef } from "react";
import { cx } from "@/lib/cx";
import { useOffscreenPause } from "@/lib/motion/useOffscreenPause";

type BackgroundBeamsProps = {
  /** ambient : 4 faisceaux ; active : 6 (CTA final). */
  intensity?: "ambient" | "active";
  className?: string;
};

/**
 * Faisceaux SVG animés en fond (CSS pur — un segment lumineux voyage le long
 * de chaque courbe via stroke-dashoffset, pathLength normalisé à 100).
 * Même courbe en S translatée par index, rails statiques dessous.
 */
export function BackgroundBeams({ intensity = "ambient", className }: BackgroundBeamsProps) {
  const gradientId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const count = intensity === "active" ? 6 : 4;

  // Les segments stroke-dashoffset repeignent en continu (mesuré derrière le
  // backdrop-filter du CTA final) : pause hors écran.
  useOffscreenPause(ref);
  const beams = Array.from({ length: count }, (_, i) => ({
    d: `M${-120 + i * 130} -60C${-120 + i * 130} -60 ${90 + i * 120} 160 ${380 + i * 110} 230C${670 + i * 100} 300 ${760 + i * 130} 560 ${760 + i * 130} 560`,
    dur: `${10 + i * 2.4}s`,
    delay: `${i * 1.8}s`,
  }));

  return (
    <div ref={ref} aria-hidden="true" className={cx("bg-beams", "fx-field", className)}>
      <svg
        className="bg-beams-svg"
        viewBox="0 0 800 500"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-fx-cyan)" stopOpacity="0" />
            <stop offset="32%" stopColor="var(--color-fx-cyan)" />
            <stop offset="62%" stopColor="var(--color-fx-indigo)" />
            <stop offset="88%" stopColor="var(--color-fx-violet)" />
            <stop offset="100%" stopColor="var(--color-fx-pink)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {beams.map((beam, i) => (
          <path
            key={`rail-${i}`}
            d={beam.d}
            stroke="var(--color-accent)"
            strokeOpacity="0.06"
            strokeWidth="1"
          />
        ))}
        {beams.map((beam, i) => (
          <path
            key={`beam-${i}`}
            className="bg-beam"
            d={beam.d}
            pathLength={100}
            stroke={`url(#${gradientId})`}
            strokeOpacity="0.5"
            strokeWidth="1.2"
            style={{ "--beam-dur": beam.dur, "--beam-delay": beam.delay }}
          />
        ))}
      </svg>
    </div>
  );
}
