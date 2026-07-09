import { describe, it, expect } from "vitest";
import { QUESTIONS, SIZE_FIELDS, fmtHeight, kidById, sizeFor } from "../src/logic.js";

describe("fmtHeight", () => {
  it("empty for blank/zero", () => {
    expect(fmtHeight("")).toBe("");
    expect(fmtHeight(null)).toBe("");
    expect(fmtHeight(0)).toBe("");
  });
  it("formats feet and inches", () => {
    expect(fmtHeight(50)).toBe("4′2″");
  });
  it("formats sub-foot heights", () => {
    expect(fmtHeight(9)).toBe("9″");
  });
});

describe("kidById", () => {
  const kids = [{ id: "k1", name: "Kai" }];
  const members = [{ id: "m1", name: "Mom" }];
  it("prefers kids, falls back to members, then null", () => {
    expect(kidById(kids, members, "k1").name).toBe("Kai");
    expect(kidById(kids, members, "m1").name).toBe("Mom");
    expect(kidById(kids, members, "zz")).toBe(null);
  });
});

describe("sizeFor", () => {
  const sizes = [{ kid_id: "k1", shirt: "M" }];
  it("finds a size row or null", () => {
    expect(sizeFor(sizes, "k1").shirt).toBe("M");
    expect(sizeFor(sizes, "k2")).toBe(null);
  });
});

describe("constants", () => {
  it("expose interview questions and size fields", () => {
    expect(QUESTIONS.length).toBe(10);
    expect(SIZE_FIELDS.map(f => f.key)).toEqual(["shirt", "pants", "shoe", "coat", "other"]);
  });
});
