import { describe, expect, it } from "vitest";

import { mapFormDetailToDefaultValues } from "./map-promotion-form-detail";
import type { PromotionFormDraft } from "../types/promotion-form.types";

describe("mapFormDetailToDefaultValues", () => {
  it("maps snapshot fields to posting form defaults", () => {
    const draft: PromotionFormDraft = {
      version: 2,
      snapshot: {
        title: "제목",
        description: "설명",
        questions: [],
        formType: "PERFORMANCE",
        closeAt: "2027-03-01T18:30:00",
        startAt: "2027-03-15T20:00:00",
        limitNum: 50,
        address: null,
        performanceImageInfoList: [
          { id: 1, imageUrl: "https://img" },
        ],
      },
    };
    const v = mapFormDetailToDefaultValues(draft);
    expect(v.title).toBe("제목");
    expect(v.date).toBe("2027-03-15");
    expect(v.time).toBe("20:00");
    expect(v.closeAt).toBe("2027-03-01T18:30:00");
    expect(v.limitPersonnel).toBe(50);
    expect(v.isUnlimitedPersonnel).toBe(false);
    expect(v.poster).toEqual({ id: 1, imageUrl: "https://img" });
    expect(v.descriptionSeed).toBe("설명");
  });

  it("treats null limitNum as unlimited", () => {
    const draft: PromotionFormDraft = {
      version: 0,
      snapshot: {
        title: null,
        description: null,
        questions: null,
        formType: null,
        closeAt: null,
        startAt: null,
        limitNum: null,
        address: null,
        performanceImageInfoList: null,
      },
    };
    const v = mapFormDetailToDefaultValues(draft);
    expect(v.isUnlimitedPersonnel).toBe(true);
    expect(v.limitPersonnel).toBe(0);
    expect(v.date).toBe("");
    expect(v.time).toBe("");
    expect(v.closeAt).toBe("");
  });

  it("defaults closeAt to a week before start when snapshot closeAt is null", () => {
    const draft: PromotionFormDraft = {
      version: 1,
      snapshot: {
        title: null,
        description: null,
        questions: null,
        formType: "PERFORMANCE",
        closeAt: null,
        startAt: "2027-03-15T20:00:00",
        limitNum: 1,
        address: null,
        performanceImageInfoList: null,
      },
    };
    const v = mapFormDetailToDefaultValues(draft);
    expect(v.closeAt).toBe("2027-03-08T00:00:00");
  });
});
