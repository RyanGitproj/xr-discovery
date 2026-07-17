"use client";

import { Fragment } from "react";
import { m, type Variants } from "framer-motion";
import { cx } from "@/lib/cx";
import { EASE_OUT } from "@/lib/motion/variants";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";

export type TextSegment = {
  text: string;
  /** solid : encre pleine ; outline : lettres néon creuses ; holo : gradient iridescent. */
  variant?: "solid" | "outline" | "holo";
  /** Le segment occupe sa propre ligne. */
  block?: boolean;
};

const VARIANT_CLASSES: Record<NonNullable<TextSegment["variant"]>, string> = {
  solid: "",
  outline: "text-outline",
  holo: "holo-text",
};

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const wordVariant: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

function variantClass(segment: TextSegment): string {
  return VARIANT_CLASSES[segment.variant ?? "solid"];
}

type TextGenerateProps = {
  segments: readonly TextSegment[];
  className?: string;
};

/**
 * Apparition du titre mot à mot (focal du hero, une fois au mount).
 * Le parent fournit la balise (h1, h2...). Lecteurs d'écran : le texte
 * complet est porté par aria-label, les mots animés sont aria-hidden.
 */
export function TextGenerate({ segments, className }: TextGenerateProps) {
  const reduce = useReducedMotionPref();

  if (reduce) {
    return (
      <span className={className}>
        {segments.map((segment, i) => (
          <span
            key={i}
            className={cx(variantClass(segment), segment.block === true && "block")}
          >
            {segment.text}
            {segment.block === true ? "" : " "}
          </span>
        ))}
      </span>
    );
  }

  return (
    <m.span
      className={className}
      aria-label={segments.map((s) => s.text).join(" ")}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {segments.map((segment, si) => (
        <span
          key={si}
          aria-hidden="true"
          className={cx(segment.block === true && "block")}
        >
          {segment.text.split(" ").map((word, wi, words) => (
            <Fragment key={wi}>
              <m.span
                variants={wordVariant}
                className={cx("inline-block", variantClass(segment))}
              >
                {word}
              </m.span>
              {wi < words.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </span>
      ))}
    </m.span>
  );
}
