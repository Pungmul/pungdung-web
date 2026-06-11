"use client";

import { useCallback } from "react";

import type { PromotionPostingQuestionsState } from "./usePromotionPostingQuestionsState";
import {
  normalizeQuestionForList,
  withOrderNos,
} from "../../lib";
import { usePromotionQuestionDraftStore } from "../../store";
import type { PromotionDraftQuestion, PromotionQuestionKind } from "../../types";

/** 질문 필드 수정·순서·옵션 UI 액션 (state 훅과 짝을 맞출 것) */
export function usePromotionPostingQuestionsActions({
  getValues,
  setValue,
  replace,
  addQuestionDraftStore,
  persistedCount,
  moveDraftRowStore,
  blurQuestionRowStore,
}: Pick<
  PromotionPostingQuestionsState,
  | "getValues"
  | "setValue"
  | "replace"
  | "addQuestionDraftStore"
  | "persistedCount"
  | "moveDraftRowStore"
  | "blurQuestionRowStore"
>) {
  const addQuestionDraft = useCallback(
    (type: PromotionQuestionKind) => {
      addQuestionDraftStore(type, persistedCount);
    },
    [addQuestionDraftStore, persistedCount]
  );

  const updateQuestion = useCallback(
    (clientTempId: string, updates: Partial<PromotionDraftQuestion>) => {
      const draft = usePromotionQuestionDraftStore.getState().questionDraft;
      if (draft?.question.clientTempId === clientTempId) {
        const merged = { ...draft.question, ...updates };
        const normalized = normalizeQuestionForList(merged, draft.insertIndex);
        const current = getValues("questions");
        const next = [...current];
        next.splice(draft.insertIndex, 0, normalized);
        replace(withOrderNos(next));
        usePromotionQuestionDraftStore.setState({
          questionDraft: null,
          focusedQuestionId: normalized.clientTempId,
        });
        return;
      }

      const current = getValues("questions");
      const idx = current.findIndex((q) => q.clientTempId === clientTempId);
      if (idx === -1) return;
      const prev = current[idx]!;
      setValue(
        `questions.${idx}`,
        { ...prev, ...updates },
        { shouldDirty: true, shouldTouch: true }
      );
    },
    [getValues, replace, setValue]
  );

  const deleteQuestion = useCallback(
    (clientTempId: string) => {
      const draft = usePromotionQuestionDraftStore.getState().questionDraft;
      if (draft?.question.clientTempId === clientTempId) {
        usePromotionQuestionDraftStore.setState({
          questionDraft: null,
          focusedQuestionId: null,
        });
        return;
      }

      const current = getValues("questions");
      const hasTarget = current.some((q) => q.clientTempId === clientTempId);
      if (!hasTarget) return;

      const next = current.filter((q) => q.clientTempId !== clientTempId);
      replace(withOrderNos(next));

      const focus = usePromotionQuestionDraftStore.getState().focusedQuestionId;
      if (focus === clientTempId) {
        usePromotionQuestionDraftStore.setState({ focusedQuestionId: null });
      }
    },
    [getValues, replace]
  );

  const moveQuestion = useCallback(
    (clientTempId: string, direction: "up" | "down") => {
      const persistedLen = getValues("questions").length;
      const draft = usePromotionQuestionDraftStore.getState().questionDraft;
      if (draft?.question.clientTempId === clientTempId) {
        moveDraftRowStore(clientTempId, direction, persistedLen);
        return;
      }

      const qs = getValues("questions");
      const currentIndex = qs.findIndex((q) => q.clientTempId === clientTempId);
      if (currentIndex === -1) return;

      const newIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= qs.length) return;

      const next = [...qs];
      const temp = next[currentIndex]!;
      next[currentIndex] = next[newIndex]!;
      next[newIndex] = temp;
      replace(withOrderNos(next));
    },
    [getValues, moveDraftRowStore, replace]
  );

  const updateQuestionOption = useCallback(
    (clientTempId: string, optionIndex: number, label: string) => {
      const current = getValues("questions");
      const idx = current.findIndex((q) => q.clientTempId === clientTempId);
      if (idx === -1) return;
      const q = current[idx]!;
      const options = q.options.map((option, index) =>
        index === optionIndex ? { ...option, label } : option
      );
      setValue(`questions.${idx}`, { ...q, options }, { shouldDirty: true });
    },
    [getValues, setValue]
  );

  const addQuestionOption = useCallback(
    (clientTempId: string) => {
      const current = getValues("questions");
      const idx = current.findIndex((q) => q.clientTempId === clientTempId);
      if (idx === -1) return;
      const q = current[idx]!;
      const options = [
        ...q.options,
        { label: "", orderNo: q.options.length + 1 },
      ];
      setValue(`questions.${idx}`, { ...q, options }, { shouldDirty: true });
    },
    [getValues, setValue]
  );

  const removeQuestionOption = useCallback(
    (clientTempId: string, optionIndex: number) => {
      const current = getValues("questions");
      const idx = current.findIndex((q) => q.clientTempId === clientTempId);
      if (idx === -1) return;
      const q = current[idx]!;
      const options = q.options
        .filter((_, index) => index !== optionIndex)
        .map((option, index) => ({ ...option, orderNo: index + 1 }));
      setValue(`questions.${idx}`, { ...q, options }, { shouldDirty: true });
    },
    [getValues, setValue]
  );

  return {
    addQuestionDraft,
    updateQuestion,
    deleteQuestion,
    moveQuestion,
    updateQuestionOption,
    addQuestionOption,
    removeQuestionOption,
    blurQuestionRow: blurQuestionRowStore,
  };
}
