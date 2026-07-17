"use client";

import { useRef, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { submitLead } from "@/actions/submitLead";
import { StepIndicator } from "@/components/forms/StepIndicator";
import { RadioCardGroup, TextField } from "@/components/forms/fields";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import {
  BUDGET_LABELS,
  DECIDEUR_LABELS,
  DUREE_LABELS,
  FIELD_LABELS,
  FORM_STEPS,
  OBJECTIF_LABELS,
  PARTICIPANTS_LABELS,
  PROJECT_LABELS,
  PUBLIC_LABELS,
} from "@/config/leadForm";
import { siteConfig } from "@/config/site";
import { leadWhatsAppText } from "@/lib/format/leadMessage";
import { buildWhatsAppLink } from "@/lib/format/whatsapp";
import { leadSchema, type Lead } from "@/lib/validations/lead";
import styles from "./LeadForm.module.css";

function toOptions<V extends string>(labels: Record<V, string>): { value: V; label: string }[] {
  return (Object.keys(labels) as V[]).map((value) => ({ value, label: labels[value] }));
}

/**
 * Formulaire de qualification multi-étapes (9 questions de la fiche d'appel
 * + coordonnées). Même schéma Zod que le serveur. Conversion double canal :
 * envoi classique OU WhatsApp pré-rempli avec le récap.
 */
export function LeadForm() {
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors },
  } = useForm<Lead>({
    resolver: standardSchemaResolver(leadSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  const isLastStep = step === FORM_STEPS.length - 1;

  function goTo(nextStep: number) {
    setStep(nextStep);
    requestAnimationFrame(() => stepHeadingRef.current?.focus());
  }

  async function nextStep() {
    const valid = await trigger(FORM_STEPS[step].fields);
    if (valid) goTo(step + 1);
  }

  function onSubmit(lead: Lead) {
    setServerError(null);
    startTransition(async () => {
      const result = await submitLead(lead);
      if (result !== undefined && !result.ok) setServerError(result.error);
    });
  }

  // Canal WhatsApp : récap de toutes les réponses déjà saisies, même partielles.
  const values = useWatch({ control });
  const whatsappHref = buildWhatsAppLink(siteConfig.whatsappNumber, leadWhatsAppText(values));

  const fieldError = (field: keyof Lead) => errors[field]?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepIndicator steps={FORM_STEPS.map((s) => s.title)} current={step} />

      <h3 ref={stepHeadingRef} tabIndex={-1} className={styles.stepTitle}>
        {FORM_STEPS[step].title}
      </h3>

      <div className={styles.fields}>
        {step === 0 && (
          <>
            <RadioCardGroup
              legend={FIELD_LABELS.projet}
              options={toOptions(PROJECT_LABELS)}
              registration={register("projet")}
              error={fieldError("projet")}
            />
            <RadioCardGroup
              legend={FIELD_LABELS.public}
              options={toOptions(PUBLIC_LABELS)}
              registration={register("public")}
              error={fieldError("public")}
            />
            <RadioCardGroup
              legend={FIELD_LABELS.participants}
              options={toOptions(PARTICIPANTS_LABELS)}
              registration={register("participants")}
              error={fieldError("participants")}
            />
          </>
        )}

        {step === 1 && (
          <>
            <TextField
              label={FIELD_LABELS.date}
              placeholder="Ex. : week-end du 15 août"
              registration={register("date")}
              error={fieldError("date")}
            />
            <TextField
              label={FIELD_LABELS.lieu}
              placeholder="Ex. : centre commercial à Antananarivo"
              registration={register("lieu")}
              error={fieldError("lieu")}
            />
            <RadioCardGroup
              legend={FIELD_LABELS.duree}
              options={toOptions(DUREE_LABELS)}
              registration={register("duree")}
              error={fieldError("duree")}
            />
          </>
        )}

        {step === 2 && (
          <>
            <RadioCardGroup
              legend={FIELD_LABELS.objectif}
              options={toOptions(OBJECTIF_LABELS)}
              registration={register("objectif")}
              error={fieldError("objectif")}
            />
            <RadioCardGroup
              legend={FIELD_LABELS.budget}
              options={toOptions(BUDGET_LABELS)}
              registration={register("budget")}
              error={fieldError("budget")}
              columns={3}
            />
            <RadioCardGroup
              legend={FIELD_LABELS.decideur}
              options={toOptions(DECIDEUR_LABELS)}
              registration={register("decideur")}
              error={fieldError("decideur")}
              columns={3}
            />
          </>
        )}

        {step === 3 && (
          <>
            <TextField
              label={FIELD_LABELS.nom}
              autoComplete="name"
              registration={register("nom")}
              error={fieldError("nom")}
            />
            <TextField
              label={FIELD_LABELS.telephone}
              type="tel"
              placeholder="+261 34 00 000 00"
              autoComplete="tel"
              registration={register("telephone")}
              error={fieldError("telephone")}
            />
            <TextField
              label={FIELD_LABELS.email}
              type="email"
              autoComplete="email"
              registration={register("email")}
              error={fieldError("email")}
            />
          </>
        )}
      </div>

      {serverError !== null && (
        <p role="alert" aria-live="polite" className={styles.serverError}>
          {serverError}
        </p>
      )}

      <div className={styles.actions}>
        <div className={styles.actionsMain}>
          {step > 0 && (
            <button type="button" onClick={() => goTo(step - 1)} className={styles.back}>
              ← Précédent
            </button>
          )}
          {isLastStep ? (
            <PrimaryButton type="submit" disabled={pending}>
              {pending ? "Envoi en cours..." : "Envoyer ma demande"}
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={() => void nextStep()}>Continuer</PrimaryButton>
          )}
        </div>
        {isLastStep && (
          <OutlineButton href={whatsappHref} className={styles.whatsapp}>
            Envoyer via WhatsApp
          </OutlineButton>
        )}
      </div>
    </form>
  );
}
