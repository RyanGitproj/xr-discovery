import { describe, expect, it } from "vitest";
import type { Lead } from "@/lib/validations/lead";
import { toLeadRow } from "./toLeadRow";

const LEAD: Lead = {
  secteur: "centres-commerciaux",
  pack: "",
  objectif: "lancement",
  budget: "a-definir",
  periode: "Décembre",
  nom: "Rasoa Mia",
  telephone: "+261331122233",
  email: "mia@exemple.mg",
  participants: "",
  entreprise: "",
  fonction: "Responsable marketing",
};

describe("toLeadRow", () => {
  it("mappe camelCase → snake_case et optionnels vides → null", () => {
    const row = toLeadRow(LEAD, null);
    expect(row.secteur).toBe("centres-commerciaux");
    expect(row.pack).toBeNull();
    expect(row.objectif_principal).toBe("lancement");
    expect(row.budget).toBe("a-definir");
    expect(row.email).toBe("mia@exemple.mg");
    expect(row.participants).toBeNull();
    expect(row.entreprise).toBeNull();
    expect(row.fonction).toBe("Responsable marketing");
  });

  it("convertit participants en nombre quand renseigné", () => {
    expect(toLeadRow({ ...LEAD, participants: "200" }, null).participants).toBe(200);
  });

  it("reporte le pack quand il est renseigné", () => {
    expect(toLeadRow({ ...LEAD, pack: "temps-fort" }, null).pack).toBe("temps-fort");
  });

  it("is_organic = true sans aucun marqueur payant", () => {
    expect(toLeadRow(LEAD, null).is_organic).toBe(true);
    expect(toLeadRow(LEAD, { referrer: "https://google.com/" }).is_organic).toBe(true);
    expect(toLeadRow(LEAD, { utm_medium: "social" }).is_organic).toBe(true);
  });

  it("is_organic = false dès qu'un marqueur payant est présent", () => {
    expect(toLeadRow(LEAD, { utm_source: "facebook" }).is_organic).toBe(false);
    expect(toLeadRow(LEAD, { fbclid: "abc" }).is_organic).toBe(false);
    expect(toLeadRow(LEAD, { gclid: "xyz" }).is_organic).toBe(false);
    expect(toLeadRow(LEAD, { ad_id: "123" }).is_organic).toBe(false);
  });

  it("reporte l'attribution dans les colonnes, absents → null", () => {
    const row = toLeadRow(LEAD, {
      utm_source: "facebook",
      campaign_name: "Lancement",
      platform: "ig",
    });
    expect(row.utm_source).toBe("facebook");
    expect(row.campaign_name).toBe("Lancement");
    expect(row.platform).toBe("ig");
    expect(row.adset_id).toBeNull();
    expect(row.referrer).toBeNull();
  });
});
