import { getDefaultSettingsByQuestionType } from "./question-type";
import type { PromotionDraftQuestion, PromotionQuestionKind } from "../types";

export function buildDraftQuestion(
  type: PromotionQuestionKind,
  orderNo: number
): PromotionDraftQuestion {
  return {
    clientTempId: `${Date.now()}-${Math.random()}`,
    questionType: type,
    label: "",
    required: true,
    orderNo,
    settingsJson: getDefaultSettingsByQuestionType(type),
    options: type === "TEXT" ? [] : [{ label: "", orderNo: 1 }],
  };
}
