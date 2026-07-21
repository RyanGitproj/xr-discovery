import { reassuranceItems } from "@/config/content";
import { cx } from "@/lib/cx";
import styles from "./ReassuranceBar.module.css";

/**
 * Section 2 du blueprint : les 5 marqueurs du pied des infographies.
 * v2 : bande STATIQUE (le marquee défilant est abandonné) pour que les
 * preuves se lisent d'un coup d'œil, icônes lucide multicolores.
 */
export function ReassuranceBar() {
  const glows = [
    styles.glowAccent,
    styles.glowPink,
    styles.glowViolet,
    styles.glowCyan,
    styles.glowHot,
  ];

  return (
    <section aria-label="Points de réassurance" className={`fx-section ${styles.section}`}>
      <ul className={styles.list}>
        {reassuranceItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <li key={item.label} className={styles.item}>
              <Icon aria-hidden="true" className={cx(styles.icon, glows[i % glows.length])} />
              {item.label}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
