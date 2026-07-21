"use client";

import { cx } from "@/lib/cx";
import { scrollToSection } from "@/lib/scrollToSection";
import styles from "./OutlineButton.module.css";

type OutlineButtonProps = {
  /** Lien externe (canal WhatsApp). Exclusif de `scrollTo`. */
  href?: string;
  /** Bouton de défilement vers une section (aucune ancre d'URL). */
  scrollTo?: string;
  /** Effet de bord additionnel au clic (ex. event dataLayer). */
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
};

/** Bouton secondaire sur verre (canal WhatsApp, CTA des packs). */
export function OutlineButton({ href, scrollTo, onClick, className, children }: OutlineButtonProps) {
  const classes = cx(styles.button, className);
  if (href !== undefined) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button
      type="button"
      className={classes}
      onClick={() => {
        onClick?.();
        if (scrollTo !== undefined) scrollToSection(scrollTo);
      }}
    >
      {children}
    </button>
  );
}
