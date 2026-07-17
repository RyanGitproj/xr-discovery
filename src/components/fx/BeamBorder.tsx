import { cx } from "@/lib/cx";

type BeamBorderProps = {
  /** active : rotation 6 s (pack vedette, CTA) ; ambient : 10 s, plus discret. */
  intensity?: "ambient" | "active";
  className?: string;
  children: React.ReactNode;
};

/**
 * Trait lumineux qui parcourt le contour (Famille A, zéro JS).
 * Conic-gradient tournant via @property --angle, masqué en anneau.
 */
export function BeamBorder({ intensity = "active", className, children }: BeamBorderProps) {
  return (
    <div className={cx("beam-border", intensity === "ambient" && "beam-border--slow", className)}>
      {children}
    </div>
  );
}
