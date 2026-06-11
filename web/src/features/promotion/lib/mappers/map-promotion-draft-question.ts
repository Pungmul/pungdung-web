import type { PromotionDraftQuestionWire } from "../../api/client/dto.schema";
import type { PromotionDraftQuestion } from "../../types/promotion-question.types";

export function mapPromotionDraftQuestionWireToClient(
  wire: PromotionDraftQuestionWire
): PromotionDraftQuestion {
  return {
    clientTempId: wire.clientTempId,
    questionType: wire.questionType,
    label: wire.label,
    required: wire.required,
    orderNo: wire.orderNo,
    imageUrl: wire.imageUrl ?? null,
    settingsJson: wire.settingsJson,
    options: wire.options.map((o) => ({
      label: o.label,
      orderNo: o.orderNo,
    })),
  };
}

export function mapPromotionDraftQuestionToWire(
  q: PromotionDraftQuestion
): PromotionDraftQuestionWire {
  return {
    clientTempId: q.clientTempId,
    questionType: q.questionType,
    label: q.label,
    required: q.required,
    orderNo: q.orderNo,
    imageUrl: q.imageUrl ?? null,
    settingsJson: q.settingsJson,
    options: q.options.map((o) => ({
      label: o.label,
      orderNo: o.orderNo,
    })),
  };
}
