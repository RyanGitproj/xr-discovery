import type { Control, FieldPath, FieldValues, UseFormRegisterReturn } from "react-hook-form";
import PhoneInputHookForm from "react-phone-number-input/react-hook-form";
import "react-phone-number-input/style.css";
import { cx } from "@/lib/cx";
import styles from "./fields.module.css";

type Option = {
  value: string;
  label: string;
};

/** Astérisque des champs obligatoires (convention * — jamais de mention
    entre parenthèses) ; le statut est porté aux AT par aria-required. */
function RequiredMark() {
  return (
    <span aria-hidden="true" className={styles.required}>
      {" "}
      *
    </span>
  );
}

type RadioCardGroupProps = {
  legend: string;
  options: readonly Option[];
  registration: UseFormRegisterReturn;
  error?: string;
  required?: boolean;
  columns?: 2 | 3;
};

/** Question à choix unique en cards radio (natives : clavier + SR gratuits). */
export function RadioCardGroup({
  legend,
  options,
  registration,
  error,
  required = false,
  columns = 2,
}: RadioCardGroupProps) {
  const errorId = `${registration.name}-error`;
  return (
    <fieldset
      aria-required={required || undefined}
      aria-describedby={error !== undefined ? errorId : undefined}
    >
      <legend className={styles.legend}>
        {legend}
        {required && <RequiredMark />}
      </legend>
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
  required?: boolean;
  type?: "text" | "tel" | "email";
  /** "numeric" : clavier chiffres sur mobile (champs quantitatifs). */
  inputMode?: "numeric";
  placeholder?: string;
  autoComplete?: string;
  /** Placement dans une grille de champs (ex. pleine largeur). */
  className?: string;
};

/** Champ texte sur verre, focus ring accent, erreur reliée par aria-describedby. */
export function TextField({
  label,
  registration,
  error,
  required = false,
  type = "text",
  inputMode,
  placeholder,
  autoComplete,
  className,
}: TextFieldProps) {
  const errorId = `${registration.name}-error`;
  return (
    <label className={cx(styles.field, className)}>
      <span className={styles.fieldLabel}>
        {label}
        {required && <RequiredMark />}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-required={required || undefined}
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

type PhoneFieldProps<T extends FieldValues> = {
  label: string;
  name: FieldPath<T>;
  control: Control<T>;
  error?: string;
  required?: boolean;
  /** Placement dans une grille de champs (ex. pleine largeur). */
  className?: string;
};

/**
 * Téléphone international (react-phone-number-input, intégration RHF
 * native) : indicatif Madagascar par défaut, valeur normalisée E.164
 * (+261…) — c'est ce format que valide le schéma Zod.
 */
export function PhoneField<T extends FieldValues>({
  label,
  name,
  control,
  error,
  required = false,
  className,
}: PhoneFieldProps<T>) {
  const errorId = `${name}-error`;
  const inputId = `${name}-input`;
  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={inputId} className={styles.fieldLabel}>
        {label}
        {required && <RequiredMark />}
      </label>
      <PhoneInputHookForm
        name={name}
        control={control}
        defaultCountry="MG"
        international
        className={styles.phone}
        numberInputProps={{
          id: inputId,
          className: cx(styles.input, styles.phoneInput),
          placeholder: "+261 34 00 000 00",
          autoComplete: "tel",
          "aria-required": required || undefined,
          "aria-invalid": error !== undefined || undefined,
          "aria-describedby": error !== undefined ? errorId : undefined,
        }}
      />
      {error !== undefined && (
        <p id={errorId} role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
