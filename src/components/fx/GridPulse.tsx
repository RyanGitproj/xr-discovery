import { cx } from "@/lib/cx";

type GridPulseProps = {
  /** ambient : respiration lente ; active : trame plus visible, statique. */
  intensity?: "ambient" | "active";
  /**
   * Id du pattern SVG — composant serveur, donc pas de useId : chaque
   * instance d'une même page doit passer un id distinct (défaut réservé à
   * la première occurrence).
   */
  patternId?: string;
  className?: string;
};

/**
 * Trame circuit (lignes + angles droits + points) qui respire faiblement.
 * Motif signature des infographies — SVG pattern, opacité animée en CSS.
 */
export function GridPulse({
  intensity = "ambient",
  patternId = "grid-pulse-pattern",
  className,
}: GridPulseProps) {
  return (
    <svg
      aria-hidden="true"
      className={cx(
        "fx-layer-svg",
        intensity === "ambient" ? "grid-pulse" : "grid-pulse-active",
        className,
      )}
    >
      <defs>
        <pattern id={patternId} width="96" height="96" patternUnits="userSpaceOnUse">
          <path
            d="M0 48h28l12-12V8M48 96V68l12-12h36M48 0v20M96 48h-20"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1"
          />
          <circle cx="48" cy="48" r="1.5" fill="var(--color-accent)" />
          <circle cx="40" cy="8" r="1.5" fill="var(--color-accent)" />
          <circle cx="76" cy="48" r="1.5" fill="var(--color-accent)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
