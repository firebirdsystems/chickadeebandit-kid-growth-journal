import { describe, it, expect } from "vitest";
import {
  QUESTIONS, SIZE_FIELDS, fmtHeight, kidById, sizeFor, searchableFields, interviewText,
  shownPhotoId, tilePhotoId, cutoutRefusal,
} from "../src/logic.js";

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

describe("interviewText / searchableFields", () => {
  it("flattens the stored interview JSON so the answers are searchable", () => {
    const raw = JSON.stringify([{ q: "What do you want to be?", a: "A marine biologist" }]);
    expect(interviewText(raw)).toContain("A marine biologist");
  });

  it("returns empty text for a malformed blob rather than throwing", () => {
    expect(interviewText("not json")).toBe("");
  });

  it("offers the interview text alongside the note", () => {
    const fields = searchableFields({ note: "lost a tooth", age_label: "Age 6", entry_date: "2026-03-04" }, "A marine biologist");
    expect(fields).toContain("A marine biologist");
    expect(fields).toContain("lost a tooth");
  });
});

describe("shownPhotoId", () => {
  it("draws the cutout when the entry has one, else the photo as taken", () => {
    expect(shownPhotoId({ photo_id: "p1", cutout_file_id: "c1" })).toBe("c1");
    expect(shownPhotoId({ photo_id: "p1", cutout_file_id: null })).toBe("p1");
    expect(shownPhotoId({ photo_id: "p1" })).toBe("p1");
    expect(shownPhotoId({ photo_id: "" })).toBe("");
  });
});

describe("cutoutRefusal", () => {
  it("tells the monthly allowance apart from the per-minute limit", () => {
    expect(cutoutRefusal(429, { limit: 100 })).toBe("This month's 100 photo cutouts are used up. The photo is kept as taken.");
    expect(cutoutRefusal(429, { error: "Too many requests" })).toBe("Too many requests just now. Try again in a minute.");
    expect(cutoutRefusal(429)).toBe("Too many requests just now. Try again in a minute.");
  });
  it("says why for each refusal the hub can give", () => {
    expect(cutoutRefusal(409)).toMatch(/already being removed/);
    expect(cutoutRefusal(402)).toMatch(/active plan/);
    expect(cutoutRefusal(503)).toMatch(/unavailable right now/);
    expect(cutoutRefusal(413)).toMatch(/too large/);
    expect(cutoutRefusal(415)).toMatch(/JPEG, PNG or WebP/);
    expect(cutoutRefusal(507)).toMatch(/no storage left/);
  });
  it("falls back to a plain sentence for anything else", () => {
    expect(cutoutRefusal(500)).toBe("The background could not be removed.");
    expect(cutoutRefusal(undefined)).toBe("The background could not be removed.");
  });
});

describe("tilePhotoId", () => {
  it("draws the small copy of the picture shown, else that picture", () => {
    expect(tilePhotoId({ photo_id: "p1", thumb_file_id: "t1", cutout_file_id: "c1", cutout_thumb_file_id: "ct1" })).toBe("ct1");
    expect(tilePhotoId({ photo_id: "p1", thumb_file_id: "t1", cutout_file_id: null })).toBe("t1");
    expect(tilePhotoId({ photo_id: "p1", thumb_file_id: null })).toBe("p1");
    expect(tilePhotoId({ photo_id: "p1" })).toBe("p1");
    expect(tilePhotoId(null)).toBe("");
  });
  it("never shows the photo's small copy for a cutout", () => {
    // A cutout with no small copy of its own is drawn whole.
    expect(tilePhotoId({ photo_id: "p1", thumb_file_id: "t1", cutout_file_id: "c1", cutout_thumb_file_id: null })).toBe("c1");
    expect(tilePhotoId({ photo_id: "p1", thumb_file_id: "t1", cutout_file_id: "c1" })).toBe("c1");
  });
});
