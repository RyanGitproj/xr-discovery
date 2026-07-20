"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { submitLead } from "@/actions/submitLead";
import { StepIndicator } from "@/components/forms/StepIndicator";
import { PhoneField, RadioCardGroup, TextField } from "@/components/forms/fields";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { offersSection } from "@/config/content";
import {
  BUDGET_LABELS,
  FIELD_LABELS,
  FORM_STEPS,
  OBJECTIF_LABELS,
  PACK_NONE_LABEL,
  SECTEUR_LABELS,
} from "@/config/leadForm";
import { MoreHorizontal } from "lucide-react";
import { OFFERS, getOffer } from "@/config/offers";
import { formatAriary } from "@/lib/format/ariary";
import { useOfferSelection } from "@/lib/offers/selection";
import { readAttribution } from "@/lib/tracking/attribution";
import { pushDataLayerEventOnce } from "@/lib/tracking/gtm";
import { leadSchema, type Lead } from "@/lib/validations/lead";
import { cx } from "@/lib/cx";
import styles from "./LeadForm.module.css";

function toOptions<V extends string>(labels: Record<V, string>): { value: V; label: string }[] {
  return (Object.keys(labels) as V[]).map((value) => ({ value, label: labels[value] }));
}

/** Options secteur : chaque offre porte son accent couleur ET son icône
    (mêmes que les tuiles de la section Offres) ; « autre » reste sur
    l'accent de marque. */
const SECTEUR_OPTIONS = [
  ...OFFERS.map((offer) => ({
    value: offer.id as Lead["secteur"],
    label: offer.name,
    accent: offer.id,
    icon: offer.icon,
  })),
  { value: "autre" as Lead["secteur"], label: SECTEUR_LABELS.autre, icon: MoreHorizontal },
];

/**
 * Garde anti double-clic : le bouton submit REMPLACE « Continuer » au même
 * endroit à l'écran — le 2e clic d'un double-clic atterrirait dessus et
 * déclencherait la validation de l'étape à peine affichée (erreurs
 * prématurées). Toute soumission dans cette fenêtre après une navigation
 * d'étape est ignorée (pattern éprouvé sur le funnel CVM/MLR).
 */
const NAV_GUARD_MS = 500;

/**
 * Formulaire court « qui conclut » : 3 étapes — secteur + pack (icônes des
 * offres), projet (objectif, budget, période, participants), puis
 * coordonnées (email et téléphone international obligatoires). Même schéma
 * Zod que le serveur ; l'attribution premier-touchpoint (UTM/pub) est
 * jointe à la soumission.
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
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Lead>({
    resolver: standardSchemaResolver(leadSchema),
    // onSubmit (pas onTouched) : avec un resolver, toute validation déclenchée
    // au blur remonte les erreurs de TOUT le schéma — des champs jamais
    // touchés s'affichaient en erreur pendant la saisie. Ici rien ne s'affiche
    // avant « Continuer » (trigger par étape), puis re-validation au change.
    mode: "onSubmit",
    defaultValues: { pack: "", email: "", participants: "", entreprise: "", fonction: "" },
  });

  // Présélection depuis « Choisir ce pack » (section Offres) : chaque nouveau
  // clic écrase la sélection, les champs restent modifiables ensuite.
  // shouldValidate efface une éventuelle erreur « secteur requis » affichée.
  const selection = useOfferSelection();
  useEffect(() => {
    if (selection === null) return;
    setValue("secteur", selection.secteur, { shouldValidate: true });
    setValue("pack", selection.pack, { shouldValidate: true });
  }, [selection, setValue]);

  const isLastStep = step === FORM_STEPS.length - 1;
  const lastNavAt = useRef(0);
  const navGuardActive = () => Date.now() - lastNavAt.current < NAV_GUARD_MS;

  function goTo(nextStep: number) {
    lastNavAt.current = Date.now();
    setStep(nextStep);
    requestAnimationFrame(() => stepHeadingRef.current?.focus());
  }

  async function nextStep() {
    if (navGuardActive()) return;
    const valid = await trigger(FORM_STEPS[step].fields);
    if (valid) goTo(step + 1);
  }

  function onSubmit(lead: Lead) {
    setServerError(null);
    startTransition(async () => {
      const result = await submitLead(lead, readAttribution());
      if (result !== undefined && !result.ok) setServerError(result.error);
    });
  }

  const fieldError = (field: keyof Lead) => errors[field]?.message;

  /** register + effacement immédiat : en mode onSubmit la validation ne court
      qu'au « Continuer » — un champ DÉJÀ en erreur re-valide dès sa
      correction (trigger ciblé, ne touche pas aux autres champs). */
  const registerField = (field: keyof Lead) =>
    register(field, {
      onChange: () => {
        if (errors[field] !== undefined) void trigger(field);
      },
    });

  /** Changement de secteur : un pack déjà coché qui n'appartient pas au
      nouveau secteur est remis à « je ne sais pas encore » — reset synchrone
      dans le onChange, aucune course avec le préremplissage. */
  const registerSecteur = register("secteur", {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextSecteur = event.target.value as Lead["secteur"];
      const currentPack = getValues("pack");
      const packStillValid =
        currentPack === "" ||
        (nextSecteur !== "autre" &&
          getOffer(nextSecteur).packs.some((pack) => pack.id === currentPack));
      if (!packStillValid) setValue("pack", "");
      if (errors.secteur !== undefined) void trigger("secteur");
    },
  });

  // Options de pack du secteur courant (aucun secteur ou « autre » : champ masqué).
  const secteurValue: Lead["secteur"] | undefined = useWatch({ control, name: "secteur" });
  const packOptions =
    secteurValue === undefined || secteurValue === "autre"
      ? null
      : [
          ...getOffer(secteurValue).packs.map((pack) => ({
            value: pack.id,
            label: `${pack.name} — ${offersSection.pricePrefix} ${formatAriary(pack.price)}`,
            accent: secteurValue,
          })),
          { value: "", label: PACK_NONE_LABEL, accent: secteurValue },
        ];

  return (
    <form
      onSubmit={(event) => {
        // Hors dernière étape, Entrée vaut « Continuer » (jamais une
        // soumission qui validerait des champs pas encore affichés).
        if (!isLastStep) {
          event.preventDefault();
          void nextStep();
          return;
        }
        if (navGuardActive()) {
          event.preventDefault();
          return;
        }
        void handleSubmit(onSubmit)(event);
      }}
      noValidate
      onFocus={() => pushDataLayerEventOnce("funnel_start", "funnel_start")}
    >
      <StepIndicator steps={FORM_STEPS.map((s) => s.title)} current={step} />

      <h3 ref={stepHeadingRef} tabIndex={-1} className={styles.stepTitle}>
        {FORM_STEPS[step].title}
      </h3>

      <div className={cx(styles.fields, step === 2 && styles.fieldsTwoCol)}>
        {step === 0 && (
          <>
            <RadioCardGroup
              legend={FIELD_LABELS.secteur}
              options={SECTEUR_OPTIONS}
              registration={registerSecteur}
              error={fieldError("secteur")}
              required
              columns={3}
            />
            {packOptions !== null && (
              <RadioCardGroup
                legend={FIELD_LABELS.pack}
                options={packOptions}
                registration={registerField("pack")}
                error={fieldError("pack")}
              />
            )}
          </>
        )}

        {step === 1 && (
          <>
            <RadioCardGroup
              legend={FIELD_LABELS.objectif}
              options={toOptions(OBJECTIF_LABELS)}
              registration={registerField("objectif")}
              error={fieldError("objectif")}
              required
            />
            <RadioCardGroup
              legend={FIELD_LABELS.budget}
              options={toOptions(BUDGET_LABELS)}
              registration={registerField("budget")}
              error={fieldError("budget")}
              required
              columns={3}
            />
            <TextField
              label={FIELD_LABELS.periode}
              placeholder="Ex. : week-end du 15 août"
              registration={registerField("periode")}
              error={fieldError("periode")}
              required
            />
            <TextField
              label={FIELD_LABELS.participants}
              inputMode="numeric"
              placeholder="Ex. : 200"
              registration={registerField("participants")}
              error={fieldError("participants")}
            />
          </>
        )}

        {step === 2 && (
          <>
            <TextField
              label={FIELD_LABELS.nom}
              autoComplete="name"
              registration={registerField("nom")}
              error={fieldError("nom")}
              required
            />
            <PhoneField
              label={FIELD_LABELS.telephone}
              name="telephone"
              control={control}
              error={fieldError("telephone")}
              required
              className={styles.spanFullMobile}
            />
            <TextField
              label={FIELD_LABELS.email}
              type="email"
              autoComplete="email"
              registration={registerField("email")}
              error={fieldError("email")}
              required
              className={styles.spanFullMobile}
            />
            <TextField
              label={FIELD_LABELS.entreprise}
              placeholder="Ex. : votre entreprise, école ou lieu"
              autoComplete="organization"
              registration={registerField("entreprise")}
              error={fieldError("entreprise")}
            />
            <TextField
              label={FIELD_LABELS.fonction}
              placeholder="Ex. : responsable marketing"
              autoComplete="organization-title"
              registration={registerField("fonction")}
              error={fieldError("fonction")}
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
              {pending ? "Envoi en cours..." : "Recevoir mon devis"}
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={() => void nextStep()}>Continuer</PrimaryButton>
          )}
        </div>
      </div>
    </form>
  );
}
