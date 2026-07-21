"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { TapHint } from "@/components/fx/TapHint";
import { PackCard } from "@/components/sections/PackCard";
import { useOfferDemo } from "@/components/sections/useOfferDemo";
import { offersSection } from "@/config/content";
import { OFFERS, getOffer, offerPriceFrom, type OfferId, type OfferPack } from "@/config/offers";
import { cx } from "@/lib/cx";
import { formatAriary } from "@/lib/format/ariary";
import { chooseOfferPack } from "@/lib/offers/selection";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";
import { EASE_OUT, fadeReduced, fadeUp, staggerChildren } from "@/lib/motion/variants";
import { pushDataLayerEvent } from "@/lib/tracking/gtm";
import styles from "./OfferExplorer.module.css";

/**
 * Interaction signature de la page : 8 tuiles secteur (pattern tabs —
 * commutateur de contenu, pas une saisie) pilotent les 3 packs affichés.
 * La tuile ACTIVE est un état local d'affichage ; la sélection ENGAGÉE
 * (secteur + pack → formulaire) n'est écrite qu'au clic « Choisir ce pack ».
 * Seule l'offre active est montée — jamais 24 cards.
 */
export function OfferExplorer() {
  const [activeId, setActiveId] = useState<OfferId>(OFFERS[0].id);
  // Souris sur les TUILES uniquement : un clic est imminent, la démo ne doit
  // pas changer la tuile sous le curseur. Le reste de la section ne suspend
  // pas — un curseur simplement posé au milieu de la page (position naturelle
  // au scroll molette) ne doit pas priver le visiteur de la démo.
  const [demoSuspended, setDemoSuspended] = useState(false);
  const tabRefs = useRef(new Map<OfferId, HTMLButtonElement>());
  const selectorWrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionPref();

  const activeOffer = getOffer(activeId);

  // Démo guidée « visite des 8 offres » : activation réelle mais sans
  // tracking ni écriture du store — boucle tant qu'aucune interaction,
  // condamnée au premier geste utilisateur (cancelDemo).
  const getTile = useCallback((offerIndex: number) => {
    const offer = OFFERS[offerIndex];
    return offer === undefined ? undefined : tabRefs.current.get(offer.id);
  }, []);
  const onDemoSelect = useCallback((offerIndex: number) => {
    const offer = OFFERS[offerIndex];
    if (offer !== undefined) setActiveId(offer.id);
  }, []);
  const { state: demo, cancel: cancelDemo } = useOfferDemo({
    wrapRef: selectorWrapRef,
    enabled: !reduce,
    suspended: demoSuspended,
    tileCount: OFFERS.length,
    getTile,
    onDemoSelect,
  });
  const suspendDemo = () => setDemoSuspended(true);
  const resumeDemo = () => setDemoSuspended(false);

  function selectOffer(id: OfferId) {
    cancelDemo();
    if (id === activeId) return;
    setActiveId(id);
    pushDataLayerEvent("offer_select", { secteur: id });
  }

  /** Tabs avec activation automatique : les flèches déplacent focus ET sélection. */
  function onTablistKeyDown(event: React.KeyboardEvent) {
    cancelDemo();
    const currentIndex = OFFERS.findIndex((offer) => offer.id === activeId);
    let nextIndex: number;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (currentIndex + 1) % OFFERS.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (currentIndex - 1 + OFFERS.length) % OFFERS.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = OFFERS.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const next = OFFERS[nextIndex];
    selectOffer(next.id);
    tabRefs.current.get(next.id)?.focus();
  }

  function choosePack(pack: OfferPack) {
    cancelDemo();
    chooseOfferPack(activeId, pack.id);
    pushDataLayerEvent("pack_choose", { secteur: activeId, pack: pack.id });
  }

  // Mêmes variants que les Reveal (lib/motion/variants) : le switch d'offre
  // parle le langage motion du reste de la page.
  const packVariants = reduce ? fadeReduced : fadeUp;

  return (
    <div>
      <p className={styles.hint}>{offersSection.hint}</p>
      <div ref={selectorWrapRef} className={styles.selectorWrap}>
        <div
          role="tablist"
          aria-label={offersSection.selectorLabel}
          className={styles.selector}
          onKeyDown={onTablistKeyDown}
          onFocusCapture={cancelDemo}
          onPointerEnter={suspendDemo}
          onPointerLeave={resumeDemo}
        >
          {OFFERS.map((offer) => {
            const Icon = offer.icon;
            const active = offer.id === activeId;
            return (
              <button
                key={offer.id}
                ref={(node) => {
                  if (node === null) tabRefs.current.delete(offer.id);
                  else tabRefs.current.set(offer.id, node);
                }}
                type="button"
                role="tab"
                id={`offre-tab-${offer.id}`}
                aria-selected={active}
                aria-controls="offre-panel"
                tabIndex={active ? 0 : -1}
                data-offer-accent={offer.id}
                className={cx(styles.tile, active && styles.tileActive)}
                onClick={() => selectOffer(offer.id)}
              >
                <Icon aria-hidden="true" className={styles.tileIcon} />
                <span className={styles.tileName}>{offer.shortName}</span>
                <span className={styles.tilePrice}>
                  {offersSection.pricePrefix}{" "}
                  <strong className={styles.tilePriceValue}>
                    {formatAriary(offerPriceFrom(offer))}
                  </strong>
                </span>
              </button>
            );
          })}
        </div>

        {demo.position !== null && (
          <m.div
            className={styles.demoHand}
            initial={false}
            animate={{ x: demo.position.x, y: demo.position.y }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            <TapHint visible={demo.visible} tapCount={demo.tapCount} />
          </m.div>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={activeId}
          role="tabpanel"
          id="offre-panel"
          aria-labelledby={`offre-tab-${activeId}`}
          data-offer-accent={activeId}
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, transition: { duration: 0.18 } }}
        >
          <m.p variants={packVariants} className={styles.panelIntro}>
            {offersSection.panelIntroPrefix}{" "}
            <strong className={styles.panelIntroOffer}>{activeOffer.name}</strong>
          </m.p>
          <m.p variants={packVariants} className={styles.tagline}>
            {activeOffer.tagline}
          </m.p>
          <div className={styles.packs}>
            {activeOffer.packs.map((pack) => (
              <m.div
                key={pack.id}
                variants={packVariants}
                className={cx(styles.packItem, pack.featured === true && styles.packItemFeatured)}
              >
                <PackCard
                  pack={pack}
                  pricePrefix={offersSection.pricePrefix}
                  cta={offersSection.cta}
                  onChoose={() => choosePack(pack)}
                />
              </m.div>
            ))}
          </div>
        </m.div>
      </AnimatePresence>
    </div>
  );
}
