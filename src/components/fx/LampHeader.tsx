import { cx } from "@/lib/cx";

type LampHeaderProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * Titre de section éclairé par le haut : ligne lumineuse + cônes coniques
 * + halo (CSS pur, statique — le reveal vient de la section qui compose).
 */
export function LampHeader({ className, children }: LampHeaderProps) {
  return (
    <div className={cx("lamp-header", className)}>
      <div aria-hidden="true" className="lamp-glow">
        <span className="lamp-cone lamp-cone--left" />
        <span className="lamp-cone lamp-cone--right" />
        <span className="lamp-line" />
        <span className="lamp-halo" />
      </div>
      <div className="lamp-content">{children}</div>
    </div>
  );
}
