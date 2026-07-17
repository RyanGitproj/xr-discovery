"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { cx } from "@/lib/cx";
import { usePointerFine } from "@/lib/motion/usePointerFine";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";

/** Distance (px) au-delà du bord où la bordure commence à s'allumer. */
const REACH = 260;

type Register = (el: HTMLElement) => () => void;

const GlowGroupContext = createContext<Register | null>(null);

type GroupProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * Porte l'UNIQUE listener pointermove d'un ensemble de cards GlowReactive
 * (règle : un listener délégué au parent, variables CSS en rAF, zéro
 * re-render). Style « Glowing Effect » de Cursor.com.
 */
export function GlowReactiveGroup({ className, children }: GroupProps) {
  const cards = useRef(new Set<HTMLElement>());
  const raf = useRef(0);
  const fine = usePointerFine();
  const reduce = useReducedMotionPref();
  const active = fine && !reduce;

  const register = useCallback<Register>((el) => {
    cards.current.add(el);
    return () => {
      cards.current.delete(el);
    };
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  function onMove(event: React.PointerEvent) {
    const { clientX, clientY } = event;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      for (const el of cards.current) {
        const rect = el.getBoundingClientRect();
        const dx = Math.max(rect.left - clientX, 0, clientX - rect.right);
        const dy = Math.max(rect.top - clientY, 0, clientY - rect.bottom);
        const strength = Math.max(0, 1 - Math.hypot(dx, dy) / REACH);
        el.style.setProperty("--glow-o", strength.toFixed(2));
        el.style.setProperty("--mx", `${clientX - rect.left}px`);
        el.style.setProperty("--my", `${clientY - rect.top}px`);
      }
    });
  }

  function onLeave() {
    cancelAnimationFrame(raf.current);
    for (const el of cards.current) {
      el.style.setProperty("--glow-o", "0");
    }
  }

  return (
    <GlowGroupContext.Provider value={register}>
      <div
        className={className}
        onPointerMove={active ? onMove : undefined}
        onPointerLeave={active ? onLeave : undefined}
      >
        {children}
      </div>
    </GlowGroupContext.Provider>
  );
}

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

/** Card dont la bordure s'illumine à l'approche du curseur. Jamais combinée à TiltCard. */
export function GlowReactive({ className, children }: CardProps) {
  const register = useContext(GlowGroupContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!register || !el) return;
    return register(el);
  }, [register]);

  return (
    <div ref={ref} className={cx("glow-reactive", className)}>
      {children}
    </div>
  );
}
