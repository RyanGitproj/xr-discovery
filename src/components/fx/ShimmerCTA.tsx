import { cx } from "@/lib/cx";

type ShimmerCTAProps = {
  /** Rend un lien si fourni, sinon un bouton. */
  href?: string;
  type?: "button" | "submit";
  size?: "sm" | "md" | "xl";
  /** false : pas de glow pulsé (navbar fixe — budget ambient). */
  pulse?: boolean;
  className?: string;
  children: React.ReactNode;
};

const SIZE_CLASSES: Record<NonNullable<ShimmerCTAProps["size"]>, string> = {
  sm: "shimmer-cta--sm",
  md: "shimmer-cta--md",
  xl: "shimmer-cta--xl",
};

/**
 * CTA principal (Famille A) : reflet qui traverse + glow pulsé lent.
 * Le glow vit sur un wrapper non clippé, le reflet sur le bouton clippé.
 */
export function ShimmerCTA({
  href,
  type = "button",
  size = "md",
  pulse = true,
  className,
  children,
}: ShimmerCTAProps) {
  const classes = cx("shimmer-cta", SIZE_CLASSES[size], className);
  const control = href ? (
    <a href={href} className={classes}>
      {children}
    </a>
  ) : (
    <button type={type} className={classes}>
      {children}
    </button>
  );
  if (!pulse) return control;
  return <span className="shimmer-glow">{control}</span>;
}
