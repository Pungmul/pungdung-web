"use client";

import { useMemo } from "react";

import {
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";

import { usePromotionQuestionDraftStore } from "../../store";
import type { PromotionPostingFormValues } from "../../types";

/** 질문 필드 배열·watch·draft 스토어에서 파생되는 읽기 전용 상태 */
export function usePromotionPostingQuestionsState() {
  const { control: formControl, getValues, setValue } =
    useFormContext<PromotionPostingFormValues>();

  const { replace } = useFieldArray({
    control: formControl,
    name: "questions",
  });

  const watchedQuestionsRaw = useWatch({
    control: formControl,
    name: "questions",
  });
  const watchedQuestions = useMemo(
    () =>
      Array.isArray(watchedQuestionsRaw) ? watchedQuestionsRaw : [],
    [watchedQuestionsRaw]
  );

  const questionDraft = usePromotionQuestionDraftStore((s) => s.questionDraft);
  const focusedQuestionId = usePromotionQuestionDraftStore(
    (s) => s.focusedQuestionId
  );
  const addQuestionDraftStore = usePromotionQuestionDraftStore(
    (s) => s.addQuestionDraft
  );
  const setFocusedQuestionId = usePromotionQuestionDraftStore(
    (s) => s.setFocusedQuestionId
  );
  const blurQuestionRowStore = usePromotionQuestionDraftStore(
    (s) => s.blurQuestionRow
  );
  const moveDraftRowStore = usePromotionQuestionDraftStore(
    (s) => s.moveDraftRow
  );

  const persistedCount = watchedQuestions.length;

  const mergedQuestions = useMemo(() => {
    if (!questionDraft) {
      return watchedQuestions;
    }
    const nextQuestions = [...watchedQuestions];
    nextQuestions.splice(questionDraft.insertIndex, 0, questionDraft.question);
    return nextQuestions;
  }, [watchedQuestions, questionDraft]);

  const persistedQuestionIds = useMemo(
    () => new Set(watchedQuestions.map((q) => q.clientTempId)),
    [watchedQuestions]
  );

  return {
    getValues,
    setValue,
    replace,
    watchedQuestions,
    questionDraft,
    focusedQuestionId,
    addQuestionDraftStore,
    setFocusedQuestionId,
    blurQuestionRowStore,
    moveDraftRowStore,
    persistedCount,
    mergedQuestions,
    persistedQuestionIds,
  };
}

export type PromotionPostingQuestionsState =
  ReturnType<typeof usePromotionPostingQuestionsState>;
