import { cx } from "@/lib/cx";

type AuroraFieldProps = {
  /** ambient : 2 nappes ; active : 3 nappes (hero uniquement). */
  intensity?: "ambient" | "active";
  className?: string;
};

/**
 * Nappes lumineuses qui dérivent lentement en fond (Famille A).
 * Gradients pré-floutés animés en transform uniquement — jamais de filter.
 */
export function AuroraField({ intensity = "ambient", className }: AuroraFieldProps) {
  return (
    <div aria-hidden="true" className={cx("aurora-field", className)}>
      <div className="aurora-blob aurora-blob--1" />
      <div className="aurora-blob aurora-blob--2" />
      {intensity === "active" && <div className="aurora-blob aurora-blob--3" />}
    </div>
  );
}
