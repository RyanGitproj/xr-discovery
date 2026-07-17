import type { UseFormRegisterReturn } from "react-hook-form";
import { cx } from "@/lib/cx";
import styles from "./fields.module.css";

type Option = {
  value: string;
  label: string;
};

type RadioCardGroupProps = {
  legend: string;
  options: readonly Option[];
  registration: UseFormRegisterReturn;
  error?: string;
  columns?: 2 | 3;
};

/** Question à choix unique en cards radio (natives : clavier + SR gratuits). */
export function RadioCardGroup({
  legend,
  options,
  registration,
  error,
  columns = 2,
}: RadioCardGroupProps) {
  const errorId = `${registration.name}-error`;
  return (
    <fieldset aria-describedby={error !== undefined ? errorId : undefined}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={cx(styles.grid, columns === 3 && styles.grid3)}>
        {options.map((option) => (
          <label key={option.value} className={styles.option}>
            <input type="radio" value={option.value} {...registration} className={styles.radio} />
            <span className={styles.card}>{option.label}</span>
          </label>
        ))}
      </div>
      {error !== undefined && (
        <p id={errorId} role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </fieldset>
  );
}

type TextFieldProps = {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  type?: "text" | "tel" | "email";
  placeholder?: string;
  autoComplete?: string;
};

/** Champ texte sur verre, focus ring accent, erreur reliée par aria-describedby. */
export function TextField({
  label,
  registration,
  error,
  type = "text",
  placeholder,
  autoComplete,
}: TextFieldProps) {
  const errorId = `${registration.name}-error`;
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error !== undefined || undefined}
        aria-describedby={error !== undefined ? errorId : undefined}
        {...registration}
        className={styles.input}
      />
      {error !== undefined && (
        <p id={errorId} role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </label>
  );
}
