import { describe, expect, it } from "vitest";
import { leadSchema, type Lead } from "./lead";

const VALID_LEAD: Lead = {
  secteur: "tourisme-agences",
  pack: "",
  objectif: "notoriete",
  budget: "2-4m",
  periode: "Octobre",
  nom: "Rasoa Mia",
  telephone: "+261331122233",
  email: "mia@exemple.mg",
  participants: "",
  entreprise: "",
  fonction: "",
};

describe("leadSchema — cohérence secteur/pack", () => {
  it("accepte un pack vide (« je ne sais pas encore »)", () => {
    expect(leadSchema.safeParse(VALID_LEAD).success).toBe(true);
  });

  it("accepte un pack appartenant au secteur choisi", () => {
    const result = leadSchema.safeParse({ ...VALID_LEAD, pack: "experience-sejour" });
    expect(result.success).toBe(true);
  });

  it("rejette un pack d'un autre secteur", () => {
    const result = leadSchema.safeParse({ ...VALID_LEAD, pack: "team-building-vr" });
    expect(result.success).toBe(false);
  });

  it("rejette un pack inconnu", () => {
    const result = leadSchema.safeParse({ ...VALID_LEAD, pack: "pack-fantome" });
    expect(result.success).toBe(false);
  });

  it("rejette un pack renseigné avec le secteur « autre »", () => {
    const result = leadSchema.safeParse({
      ...VALID_LEAD,
      secteur: "autre",
      pack: "experience-sejour",
    });
    expect(result.success).toBe(false);
  });

  it("accepte le secteur « autre » sans pack", () => {
    expect(leadSchema.safeParse({ ...VALID_LEAD, secteur: "autre" }).success).toBe(true);
  });
});
