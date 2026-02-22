import { create } from "zustand";

import { buildDraftQuestion } from "../lib/build-question-draft";
import type { PromotionDraftQuestion, PromotionQuestionKind } from "../types";

type QuestionDraftState = {
  questionDraft: {
    question: PromotionDraftQuestion;
    insertIndex: number;
  } | null;
  focusedQuestionId: string | null;
  addQuestionDraft: (
    type: PromotionQuestionKind,
    persistedQuestionCount: number
  ) => void;
  moveDraftRow: (
    clientTempId: string,
    direction: "up" | "down",
    persistedLen: number
  ) => void;
  setFocusedQuestionId: (id: string | null) => void;
  blurQuestionRow: (clientTempId: string) => void;
  reset: () => void;
};

export const usePromotionQuestionDraftStore = create<QuestionDraftState>(
  (set, get) => ({
    questionDraft: null,
    focusedQuestionId: null,
    addQuestionDraft: (type, persistedQuestionCount) => {
      const newDraft = buildDraftQuestion(type, persistedQuestionCount + 1);
      set({
        questionDraft: {
          question: newDraft,
          insertIndex: persistedQuestionCount,
        },
        focusedQuestionId: newDraft.clientTempId,
      });
    },
    moveDraftRow: (clientTempId, direction, persistedLen) => {
      const draft = get().questionDraft;
      if (!draft || draft.question.clientTempId !== clientTempId) {
        return;
      }

      const insertIndex = draft.insertIndex;
      const newIndex = direction === "up" ? insertIndex - 1 : insertIndex + 1;
      if (newIndex < 0 || newIndex > persistedLen) {
        return;
      }

      set({ questionDraft: { ...draft, insertIndex: newIndex } });
    },
    setFocusedQuestionId: (id) => set({ focusedQuestionId: id }),
    blurQuestionRow: (clientTempId) => {
      const state = get();
      if (state.questionDraft?.question.clientTempId === clientTempId) {
        set({ questionDraft: null, focusedQuestionId: null });
        return;
      }
      if (state.focusedQuestionId === clientTempId) {
        set({ focusedQuestionId: null });
      }
    },
    reset: () => set({ questionDraft: null, focusedQuestionId: null }),
  })
);
