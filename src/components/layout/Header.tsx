"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { navLinks } from "@/config/content";
import { cx } from "@/lib/cx";
import styles from "./Header.module.css";

/** Navbar flottante en verre fin, se compacte au scroll. ScrollProgress au bord bas. */
export function Header() {
  const [compact, setCompact] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setCompact(latest > 24);
  });

  return (
    <header className={styles.header}>
      <GlassPanel thin degradeOffscreen={false} className={styles.panel}>
        <div className={cx(styles.bar, compact && styles.compact)}>
          <a href="#" className={styles.logo}>
            <span className={styles.logoMark}>XR</span>
            <span>VR Discovery</span>
          </a>
          <nav aria-label="Navigation principale" className={styles.nav}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </a>
            ))}
          </nav>
          <ShimmerCTA href="#devis" size="sm" pulse={false}>
            Demander un devis
          </ShimmerCTA>
        </div>
        <ScrollProgress />
      </GlassPanel>
    </header>
  );
}
