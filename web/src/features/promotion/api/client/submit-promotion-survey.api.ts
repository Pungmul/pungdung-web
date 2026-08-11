import { clientApiRequest } from "@/core/api/client";

import { submitSurveyResponseSchema } from "./dto.schema";
import { mapPromotionSurveySubmitAnswersToWire } from "../../lib/mappers";
import type { PromotionSurveySubmitAnswer } from "../../types";

export async function submitPromotionSurvey(
  publicId: string,
  answers: PromotionSurveySubmitAnswer[]
) {
  return clientApiRequest({
    url: `/api/promotions/submit/${publicId}`,
    method: "POST",
    body: mapPromotionSurveySubmitAnswersToWire(answers),
    responseSchema: submitSurveyResponseSchema,
  });
}
