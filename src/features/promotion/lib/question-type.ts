import { match } from "ts-pattern";

import type {
  PromotionDraftQuestion,
  PromotionDraftQuestionOption,
  PromotionQuestionKind,
} from "../types";

/**
 * 질문 유형에 해당하는 라벨을 반환합니다.
 */
export function getQuestionTypeLabel(type: PromotionQuestionKind): string {
  return match(type)
    .with("TEXT", () => "단답형")
    .with("CHOICE", () => "객관식")
    .with("CHECKBOX", () => "체크 리스트")
    .otherwise(() => "");
}

export function getDefaultSettingsByQuestionType(
  type: PromotionQuestionKind
): string {
  return match(type)
    .with("TEXT", () => JSON.stringify({ maxLength: 100, placeholder: "" }))
    .with("CHOICE", () =>
      JSON.stringify({ shuffleOptions: false, allowOther: false })
    )
    .with("CHECKBOX", () => JSON.stringify({ min: 1, max: 5 }))
    .otherwise(() => "{}");
}

export function getQuestionOptionsOnTypeChange(
  prevType: PromotionQuestionKind,
  nextType: PromotionQuestionKind,
  prevOptions: PromotionDraftQuestionOption[]
): PromotionDraftQuestionOption[] {
  if (nextType === "TEXT") {
    return [];
  }

  if (prevType === "TEXT") {
    return [{ label: "", orderNo: 1 }];
  }

  return prevOptions;
}

export function buildQuestionTypeChangeUpdates(
  question: PromotionDraftQuestion,
  nextType: PromotionQuestionKind
): Partial<PromotionDraftQuestion> {
  return {
    questionType: nextType,
    settingsJson: getDefaultSettingsByQuestionType(nextType),
    options: getQuestionOptionsOnTypeChange(
      question.questionType,
      nextType,
      question.options
    ),
  };
}
