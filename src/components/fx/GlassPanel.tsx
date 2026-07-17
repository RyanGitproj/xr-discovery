"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";
import { useOffscreenPause } from "@/lib/motion/useOffscreenPause";

type GlassPanelProps = ComponentPropsWithoutRef<"div"> & {
  /** Réfraction C4 (Chromium, @supports) — réserver aux grands panneaux. */
  liquid?: boolean;
  /** Blur 12px au lieu de var(--glass-blur) (navbar, éléments fins). */
  thin?: boolean;
  /**
   * Alias visuel conservé pour les cards de surface : elles restent
   * transparentes et floutent leur arrière-plan.
   */
  surface?: boolean;
  /**
   * Coupe le backdrop-filter hors écran (budget : max 3 actifs par viewport).
   * À désactiver uniquement pour les éléments fixed toujours visibles.
   */
  degradeOffscreen?: boolean;
};

/** Liquid glass 4 couches (recette chap. 5) : frost, liseré, sheen, réfraction. */
export function GlassPanel({
  liquid = false,
  thin = false,
  surface = false,
  degradeOffscreen = true,
  className,
  ...rest
}: GlassPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  useOffscreenPause(ref, degradeOffscreen && !surface);

  return (
    <div
      ref={ref}
      className={cx(
        "glass-panel",
        liquid && "glass-panel--liquid",
        thin && "glass-panel--thin",
        surface && "glass-panel--surface",
        className,
      )}
      {...rest}
    />
  );
}
