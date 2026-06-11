import { z } from "zod";

import type { PromotionPublishedQuestion } from "../types/promotion-question.types";
import {
  type PromotionSurveyQuestion,
  promotionSurveyQuestionSchema,
} from "../types/schemas/promotion-survey-question.schema";

const promotionSurveyQuestionListSchema = z.array(promotionSurveyQuestionSchema);

export type NormalizePromotionSurveyQuestionsResult =
  | { ok: true; data: PromotionSurveyQuestion[] }
  | { ok: false; error: z.ZodError };

/**
 * 공개 설문 API 문항을 설문 응답 UI에서 쓰기 좋은 형태로 검증·정규화한다.
 */
export function normalizePromotionSurveyQuestions(
  questions: PromotionPublishedQuestion[]
): NormalizePromotionSurveyQuestionsResult {
  const result = promotionSurveyQuestionListSchema.safeParse(questions);
  if (!result.success) {
    return { ok: false, error: result.error };
  }
  return { ok: true, data: result.data };
}
