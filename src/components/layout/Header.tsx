"use client";

import { useState } from "react";
import Image from "next/image";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { navLinks } from "@/config/content";
import { cx } from "@/lib/cx";
import { logoImage } from "@/config/images";
import { scrollToSection, scrollToTop } from "@/lib/scrollToSection";
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
          <button type="button" className={styles.logo} onClick={scrollToTop}>
            <Image
              src={logoImage.src}
              alt={logoImage.alt}
              width={logoImage.width}
              height={logoImage.height}
              priority
              unoptimized
              className={styles.logoImg}
            />
          </button>
          <nav aria-label="Navigation principale" className={styles.nav}>
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                className={styles.navLink}
                onClick={() => scrollToSection(link.id)}
              >
                {link.label}
              </button>
            ))}
          </nav>
          <ShimmerCTA scrollTo="devis" size="sm" pulse={false}>
            Demander un devis
          </ShimmerCTA>
        </div>
        <ScrollProgress />
      </GlassPanel>
    </header>
  );
}
