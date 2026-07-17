import { describe, expect, it } from "vitest";
import { formatAriary, formatNumberFr } from "./ariary";

const THIN = String.fromCharCode(0x202f); // espace fine insécable
const NBSP = String.fromCharCode(0x00a0);

describe("formatNumberFr", () => {
  it("groupe les milliers avec une espace fine insécable", () => {
    expect(formatNumberFr(1600000)).toBe(`1${THIN}600${THIN}000`);
    expect(formatNumberFr(3300000)).toBe(`3${THIN}300${THIN}000`);
    expect(formatNumberFr(6900000)).toBe(`6${THIN}900${THIN}000`);
  });

  it("laisse intacts les nombres < 1000", () => {
    expect(formatNumberFr(0)).toBe("0");
    expect(formatNumberFr(10)).toBe("10");
    expect(formatNumberFr(999)).toBe("999");
  });

  it("arrondit les décimales et gère le signe", () => {
    expect(formatNumberFr(1599999.6)).toBe(`1${THIN}600${THIN}000`);
    expect(formatNumberFr(-2500)).toBe(`-2${THIN}500`);
  });
});

describe("formatAriary", () => {
  it("suffixe Ar avec espace insécable", () => {
    expect(formatAriary(1600000)).toBe(`1${THIN}600${THIN}000${NBSP}Ar`);
  });
});
