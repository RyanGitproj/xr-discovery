import { describe, expect, it } from "vitest";
import type { Lead } from "@/lib/validations/lead";
import { leadEmailText, leadRecapLines, leadWhatsAppText } from "./leadMessage";

const LEAD: Lead = {
  projet: "temps-fort",
  public: "familles",
  participants: "300-1000",
  date: "Week-end du 15 août",
  lieu: "Antananarivo",
  duree: "weekend",
  objectif: "trafic",
  budget: "2-4m",
  decideur: "decide",
  nom: "Rakoto Jean",
  telephone: "+261 34 00 000 00",
  email: "",
};

describe("leadRecapLines", () => {
  it("traduit les valeurs en libellés français", () => {
    const lines = leadRecapLines(LEAD);
    expect(lines).toContain("Votre projet : Temps fort commercial");
    expect(lines).toContain("Budget : 2 à 4 M Ar");
    expect(lines).toContain("Votre rôle : Je décide");
  });

  it("récapitule un lead partiel (canal WhatsApp avant validation)", () => {
    expect(leadRecapLines({ projet: "temps-fort", lieu: "Analakely" })).toEqual([
      "Votre projet : Temps fort commercial",
      "Lieu : Analakely",
    ]);
    expect(leadRecapLines({})).toEqual([]);
  });

  it("omet l'email vide, l'inclut sinon", () => {
    expect(leadRecapLines(LEAD).some((l) => l.startsWith("Email"))).toBe(false);
    const withEmail = leadRecapLines({ ...LEAD, email: "jean@exemple.mg" });
    expect(withEmail).toContain("Email : jean@exemple.mg");
  });
});

describe("leadEmailText / leadWhatsAppText", () => {
  it("préfixe le récap d'une accroche adaptée au canal", () => {
    expect(leadEmailText(LEAD)).toMatch(/^Nouveau lead XR VR Discovery :/);
    expect(leadWhatsAppText(LEAD)).toMatch(/^Bonjour XR Technology !/);
  });
});
