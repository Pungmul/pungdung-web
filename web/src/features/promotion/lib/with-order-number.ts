import type { PromotionDraftQuestion } from "../types";

export function withOrderNos(
  questions: PromotionDraftQuestion[]
): PromotionDraftQuestion[] {
  return questions.map((item, index) => ({
    ...item,
    orderNo: index + 1,
  }));
}
