"use client";

import { useId } from "react";
import { cx } from "@/lib/cx";
import styles from "./HoloHeadset.module.css";

type HoloHeadsetProps = {
  className?: string;
  /**
   * Cône + émetteur intégrés sous le casque. À désactiver quand la scène
   * fournit sa propre source de projection (ex. faisceau depuis Antananarivo).
   */
  projector?: boolean;
};

/**
 * Casque VR holographique (v1.2) : SVG stylisé au trait néon dégradé,
 * fantômes chromatiques cyan/rose, scanlines, flottement lent et cône de
 * projection pulsé. Le sujet de la landing, mis en scène comme un hologramme.
 */
export function HoloHeadset({ className, projector = true }: HoloHeadsetProps) {
  const gradientId = useId();

  return (
    <div aria-hidden="true" className={cx(styles.root, className)}>
      {projector && (
        <>
          {/* cône de projection sous le casque */}
          <div className={cx("holo-cone", styles.cone)} />
          {/* émetteur */}
          <div className={styles.emitter} />
        </>
      )}

      <div className={cx("holo-float", styles.float)}>
        <svg viewBox="0 0 300 180" className={styles.svg}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-fx-cyan)" />
              <stop offset="55%" stopColor="var(--color-fx-violet)" />
              <stop offset="100%" stopColor="var(--color-fx-pink)" />
            </linearGradient>
          </defs>

          {/* anneau du bandeau */}
          <ellipse
            cx="150"
            cy="86"
            rx="126"
            ry="36"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="2"
            opacity="0.45"
          />

          {/* fantômes chromatiques */}
          <rect
            x="57"
            y="36"
            width="180"
            height="92"
            rx="36"
            fill="none"
            stroke="var(--color-fx-cyan)"
            strokeWidth="1.5"
            opacity="0.35"
          />
          <rect
            x="63"
            y="42"
            width="180"
            height="92"
            rx="36"
            fill="none"
            stroke="var(--color-fx-pink)"
            strokeWidth="1.5"
            opacity="0.35"
          />

          {/* visière */}
          <rect
            x="60"
            y="39"
            width="180"
            height="92"
            rx="36"
            fill="rgba(11, 23, 48, 0.65)"
            stroke={`url(#${gradientId})`}
            strokeWidth="2.5"
          />

          {/* reflet */}
          <rect x="76" y="50" width="66" height="16" rx="8" fill="rgba(255, 255, 255, 0.14)" />

          {/* ligne frontale lumineuse */}
          <line
            x1="86"
            y1="104"
            x2="214"
            y2="104"
            stroke={`url(#${gradientId})`}
            strokeWidth="2"
            opacity="0.85"
          />

          {/* pods latéraux */}
          <rect
            x="44"
            y="64"
            width="14"
            height="42"
            rx="7"
            fill="rgba(24, 204, 252, 0.22)"
            stroke="var(--color-fx-cyan)"
            strokeWidth="1.5"
          />
          <rect
            x="242"
            y="64"
            width="14"
            height="42"
            rx="7"
            fill="rgba(255, 78, 205, 0.2)"
            stroke="var(--color-fx-pink)"
            strokeWidth="1.5"
          />
        </svg>

        {/* scanlines holographiques sur la visière */}
        <div className={cx("holo-scanlines", styles.scanlines)} />
      </div>
    </div>
  );
}
