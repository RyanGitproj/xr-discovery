import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ALL_PACK_IDS, OFFERS, OFFER_IDS, offerPriceFrom } from "./offers";

/**
 * Invariants du catalogue : les ids servent de valeurs Zod et de colonnes
 * DB, la structure 3 packs à prix croissants structure l'UI (sélecteur,
 * good-better-best).
 */
describe("catalogue des offres", () => {
  it("expose les 8 offres, dans l'ordre des ids", () => {
    expect(OFFERS.map((offer) => offer.id)).toEqual([...OFFER_IDS]);
  });

  it("a des ids de packs uniques globalement (valeurs Zod + colonne DB)", () => {
    expect(new Set(ALL_PACK_IDS).size).toBe(ALL_PACK_IDS.length);
    expect(ALL_PACK_IDS).toHaveLength(OFFERS.length * 3);
  });

  it("a 3 packs à prix strictement croissants par offre", () => {
    for (const offer of OFFERS) {
      const [entry, middle, premium] = offer.packs;
      expect(entry.price).toBeLessThan(middle.price);
      expect(middle.price).toBeLessThan(premium.price);
    }
  });

  it("met en avant exactement le pack central de chaque offre", () => {
    for (const offer of OFFERS) {
      expect(offer.packs.filter((pack) => pack.featured === true)).toHaveLength(1);
      expect(offer.packs[1].featured).toBe(true);
    }
  });

  it("offerPriceFrom retourne le prix du pack d'entrée", () => {
    for (const offer of OFFERS) {
      expect(offerPriceFrom(offer)).toBe(offer.packs[0].price);
    }
  });

  it("chaque offre a son token couleur et sa map d'accent dans globals.css", () => {
    const globalsCss = readFileSync(
      join(__dirname, "..", "app", "globals.css"),
      "utf8",
    );
    for (const id of OFFER_IDS) {
      expect(globalsCss).toContain(`--color-offer-${id}:`);
      expect(globalsCss).toContain(`[data-offer-accent="${id}"]`);
    }
  });
});
