"use client";

import { usePromotionPostingQuestionsActions } from "./usePromotionPostingQuestionsActions";
import { usePromotionPostingQuestionsState } from "./usePromotionPostingQuestionsState";

/** 질문 필드 배열 + 드래프트 행(zustand) 조합 */
export function usePromotionPostingQuestions() {
  const state = usePromotionPostingQuestionsState();
  const actions = usePromotionPostingQuestionsActions(state);

  return {
    mergedQuestions: state.mergedQuestions,
    persistedQuestionIds: state.persistedQuestionIds,
    questionDraft: state.questionDraft,
    focusedQuestionId: state.focusedQuestionId,
    setFocusedQuestionId: state.setFocusedQuestionId,
    ...actions,
  };
}
