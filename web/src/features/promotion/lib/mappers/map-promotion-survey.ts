import type { PromotionSurveySubmitBodyWire } from "../../api/client/dto.schema";
import type { PromotionSurveySubmitAnswer } from "../../types/promotion-response.types";

export function mapPromotionSurveySubmitAnswersToWire(
  answers: PromotionSurveySubmitAnswer[]
): PromotionSurveySubmitBodyWire {
  return {
    answers: answers.map((a) => ({
      questionId: a.questionId,
      selectedOptionIds: a.selectedOptionIds,
      answerText: a.answerText,
    })),
  };
}
