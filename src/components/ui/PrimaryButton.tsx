import { cx } from "@/lib/cx";
import styles from "./PrimaryButton.module.css";

type PrimaryButtonProps = {
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** Bouton plein sobre (contrôles du formulaire) — le spectacle reste aux ShimmerCTA. */
export function PrimaryButton({
  type = "button",
  onClick,
  disabled,
  className,
  children,
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(styles.button, className)}
    >
      {children}
    </button>
  );
}
