import { Reveal } from "@/components/fx/Reveal";
import { cx } from "@/lib/cx";
import styles from "./SectionHeading.module.css";

type SectionHeadingProps = {
  kicker: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
};

/** En-tête de section : kicker accent + titre display (+ sous-titre), en Reveal. */
export function SectionHeading({ kicker, title, subtitle, align = "center" }: SectionHeadingProps) {
  return (
    <Reveal className={cx(align === "center" && styles.center)}>
      <p className={styles.kicker}>{kicker}</p>
      <h2 className={cx("holo-text", styles.title)}>{title}</h2>
      {subtitle !== undefined && (
        <p className={cx(styles.subtitle, align === "center" && styles.subtitleCenter)}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
