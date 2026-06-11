import { mapPromotionPublishedOptionWireToClient } from "./map-promotion-published-question";
import type {
  PromotionApplicantAnswerWire,
  PromotionApplicationDetailWire,
} from "../../api/client/dto.schema";
import type { PromotionApplicantAnswer } from "../../types/promotion-question.types";
import type {
  PromotionApplicationDetail,
} from "../../types/promotion-response.types";

function mapPromotionApplicantAnswerWireToClient(
  wire: PromotionApplicantAnswerWire
): PromotionApplicantAnswer {
  return {
    questionId: wire.questionId,
    selectedOptions: wire.selectedOptions.map(
      mapPromotionPublishedOptionWireToClient
    ),
    answerText: wire.answerText,
  };
}

export function mapPromotionApplicationDetailWireToClient(
  wire: PromotionApplicationDetailWire
): PromotionApplicationDetail {
  return {
    responseId: wire.responseId,
    formId: wire.formId,
    submitterUsername: wire.submitterUsername,
    submitterNickname: wire.submitterNickname,
    submittedAt: wire.submittedAt,
    answerList: wire.answerList.map(mapPromotionApplicantAnswerWireToClient),
  };
}
