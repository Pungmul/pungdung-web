import type {
  PromotionPublishedOptionWire,
  PromotionPublishedQuestionWire,
} from "../../api/client/dto.schema";
import type {
  PromotionPublishedQuestion,
  PromotionPublishedQuestionOption,
} from "../../types/promotion-question.types";

export function mapPromotionPublishedOptionWireToClient(
  wire: PromotionPublishedOptionWire
): PromotionPublishedQuestionOption {
  return {
    id: wire.id,
    label: wire.label,
    orderNo: wire.orderNo,
  };
}

export function mapPromotionPublishedQuestionWireToClient(
  wire: PromotionPublishedQuestionWire
): PromotionPublishedQuestion {
  return {
    id: wire.id,
    questionType: wire.questionType,
    label: wire.label,
    required: wire.required,
    orderNo: wire.orderNo,
    imageUrl: wire.imageUrl ?? null,
    settingsJson: wire.settingsJson,
    options: wire.options.map(mapPromotionPublishedOptionWireToClient),
  };
}
