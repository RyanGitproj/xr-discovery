"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";

type TextScrollRevealProps = {
  text: string;
  className?: string;
};

/**
 * L'argumentaire se révèle mot par mot au fil du scroll : chaque mot passe
 * de 15 % à 100 % d'opacité (Famille C). UNE SEULE occurrence par page.
 * Bidirectionnel et déterministe — remonter rejoue l'état exact.
 */
export function TextScrollReveal({ text, className }: TextScrollRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotionPref();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");

  if (reduce) {
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}

type WordProps = {
  progress: MotionValue<number>;
  range: [number, number];
  children: string;
};

function Word({ progress, range, children }: WordProps) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <>
      <m.span style={{ opacity }} className="inline-block">
        {children}
      </m.span>{" "}
    </>
  );
}
