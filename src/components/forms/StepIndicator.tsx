import { cx } from "@/lib/cx";
import styles from "./StepIndicator.module.css";

type StepIndicatorProps = {
  steps: readonly string[];
  current: number;
};

/** Progression du formulaire multi-étapes : barres + intitulés. */
export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <ol aria-label="Étapes du formulaire" className={styles.list}>
      {steps.map((title, i) => (
        <li key={title} className={styles.step} aria-current={i === current ? "step" : undefined}>
          <span className={cx(styles.bar, i <= current && styles.barDone)} />
          <span className={cx(styles.label, i === current && styles.labelCurrent)}>{title}</span>
        </li>
      ))}
    </ol>
  );
}
