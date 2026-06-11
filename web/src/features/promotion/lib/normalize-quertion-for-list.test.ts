import { describe, expect, it } from "vitest";

import { normalizeQuestionForList } from "./normalize-quertion-for-list";
import type { PromotionDraftQuestion } from "../types";

const textQ = (): PromotionDraftQuestion => ({
  clientTempId: "c1",
  questionType: "TEXT",
  label: "T",
  required: false,
  orderNo: 99,
  settingsJson: "{}",
  options: [{ label: "should strip", orderNo: 1 }],
});

const choiceQ = (): PromotionDraftQuestion => ({
  clientTempId: "c2",
  questionType: "CHOICE",
  label: "C",
  required: true,
  orderNo: 5,
  settingsJson: "{}",
  options: [],
});

describe("normalizeQuestionForList", () => {
  it("sets orderNo from insertIndex", () => {
    const q = normalizeQuestionForList(textQ(), 2);
    expect(q.orderNo).toBe(3);
  });

  it("TEXT: forces empty options", () => {
    const q = normalizeQuestionForList(textQ(), 0);
    expect(q.options).toEqual([]);
  });

  it("CHOICE: seeds one empty option when none", () => {
    const q = normalizeQuestionForList(choiceQ(), 0);
    expect(q.options).toEqual([{ label: "", orderNo: 1 }]);
  });
});
