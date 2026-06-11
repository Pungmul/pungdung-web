import { describe, expect, it } from "vitest";

import {
  buildQuestionTypeChangeUpdates,
  getDefaultSettingsByQuestionType,
  getQuestionOptionsOnTypeChange,
  getQuestionTypeLabel,
} from "./question-type";
import type { PromotionDraftQuestion } from "../types";

describe("getQuestionTypeLabel", () => {
  it("returns Korean labels", () => {
    expect(getQuestionTypeLabel("TEXT")).toBe("단답형");
    expect(getQuestionTypeLabel("CHOICE")).toBe("객관식");
    expect(getQuestionTypeLabel("CHECKBOX")).toBe("체크 리스트");
  });
});

describe("getDefaultSettingsByQuestionType", () => {
  it("returns JSON strings with expected keys", () => {
    expect(JSON.parse(getDefaultSettingsByQuestionType("TEXT"))).toMatchObject({
      maxLength: 100,
    });
    expect(
      JSON.parse(getDefaultSettingsByQuestionType("CHECKBOX"))
    ).toMatchObject({ min: 1, max: 5 });
  });
});

describe("getQuestionOptionsOnTypeChange", () => {
  it("clears options when switching to TEXT", () => {
    expect(
      getQuestionOptionsOnTypeChange("CHOICE", "TEXT", [
        { label: "a", orderNo: 1 },
      ])
    ).toEqual([]);
  });

  it("seeds one row when switching from TEXT to CHOICE", () => {
    expect(getQuestionOptionsOnTypeChange("TEXT", "CHOICE", [])).toEqual([
      { label: "", orderNo: 1 },
    ]);
  });

  it("keeps options when both non-TEXT", () => {
    const prev = [{ label: "x", orderNo: 1 }];
    expect(
      getQuestionOptionsOnTypeChange("CHOICE", "CHECKBOX", prev)
    ).toEqual(prev);
  });
});

describe("buildQuestionTypeChangeUpdates", () => {
  it("updates type, settingsJson, and options", () => {
    const q: PromotionDraftQuestion = {
      clientTempId: "t1",
      questionType: "TEXT",
      label: "L",
      required: false,
      orderNo: 1,
      settingsJson: "{}",
      options: [],
    };
    const u = buildQuestionTypeChangeUpdates(q, "CHOICE");
    expect(u.questionType).toBe("CHOICE");
    expect(u.settingsJson).toBeDefined();
    expect(u.options).toEqual([{ label: "", orderNo: 1 }]);
  });
});
