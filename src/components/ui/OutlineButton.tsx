import { cx } from "@/lib/cx";
import styles from "./OutlineButton.module.css";

type OutlineButtonProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

/** Bouton secondaire sur verre — canal WhatsApp, CTA des packs. */
export function OutlineButton({ href, className, children }: OutlineButtonProps) {
  return (
    <a href={href} className={cx(styles.button, className)}>
      {children}
    </a>
  );
}
