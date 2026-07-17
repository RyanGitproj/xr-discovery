import { cx } from "@/lib/cx";
import styles from "./Pill.module.css";

type PillProps = {
  className?: string;
  children: React.ReactNode;
};

/** Badge pill sur verre : options, kickers, mentions « à partir de ». */
export function Pill({ className, children }: PillProps) {
  return <span className={cx(styles.pill, className)}>{children}</span>;
}
