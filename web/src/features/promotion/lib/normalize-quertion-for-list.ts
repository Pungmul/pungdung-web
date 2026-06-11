import type { PromotionDraftQuestion } from "../types";

export function normalizeQuestionForList(
  question: PromotionDraftQuestion,
  insertIndex: number
): PromotionDraftQuestion {
  return {
    ...question,
    orderNo: insertIndex + 1,
    options:
      question.questionType === "TEXT"
        ? []
        : question.options.length > 0
        ? question.options
        : [{ label: "", orderNo: 1 }],
  };
}
