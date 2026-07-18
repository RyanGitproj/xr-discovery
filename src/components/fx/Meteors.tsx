import { cx } from "@/lib/cx";
import { pseudoRandom } from "@/lib/pseudoRandom";

const METEOR_COLORS = [
  { core: "#ff9a3c", trail: "rgba(255, 154, 60, 0.6)" },
  { core: "#e82818", trail: "rgba(232, 40, 24, 0.55)" },
  { core: "#f5431c", trail: "rgba(245, 67, 28, 0.55)" },
];

type MeteorsProps = {
  /** Hero : 3-4 ; CTA final : 2-3. Rares par construction (1 visible / 4-6 s). */
  count?: number;
  className?: string;
};

/** Traits filants diagonaux rares (Famille A) — transform + opacity uniquement. */
export function Meteors({ count = 4, className }: MeteorsProps) {
  return (
    <div
      aria-hidden="true"
      className={cx("fx-layer", className)}
    >
      {Array.from({ length: count }, (_, i) => {
        const color = METEOR_COLORS[i % METEOR_COLORS.length];
        return (
          <span
            key={i}
            className="meteor"
            style={{
              "--meteor-top": `${Math.round(pseudoRandom(i, 0) * 45)}%`,
              "--meteor-left": `${Math.round(25 + pseudoRandom(i, 1) * 70)}%`,
              "--meteor-delay": `${(pseudoRandom(i, 2) * 9).toFixed(1)}s`,
              "--meteor-dur": `${(8 + pseudoRandom(i, 3) * 6).toFixed(1)}s`,
              "--meteor-color": color.core,
              "--meteor-trail": color.trail,
            }}
          />
        );
      })}
    </div>
  );
}
