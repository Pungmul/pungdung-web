"use client";

import { useCallback } from "react";

import { Alert } from "@/shared";

/** 질문 행 간 포커스 이동 시, 편집 중인 다른 행의 미저장 드래프트가 있으면 확인 후 blur */
export function usePromotionQuestionFocusGuard({
  focusedQuestionId,
  setFocusedQuestionId,
  blurQuestionRow,
}: {
  focusedQuestionId: string | null;
  setFocusedQuestionId: (id: string) => void;
  blurQuestionRow: (clientTempId: string) => void;
}) {
  const handleFocusQuestion = useCallback(
    (nextQuestionId: string) => {
      if (!focusedQuestionId || focusedQuestionId === nextQuestionId) {
        setFocusedQuestionId(nextQuestionId);
        return;
      }

      Alert.confirm({
        title: "질문 이동",
        message: "저장하지 않은 정보가 사라집니다.",
        onConfirm: () => {
          blurQuestionRow(focusedQuestionId);
          setFocusedQuestionId(nextQuestionId);
        },
        onCancel: () => {},
        confirmText: "이동하기",
        cancelText: "계속 수정",
        confirmColor: "red",
      });
    },
    [blurQuestionRow, focusedQuestionId, setFocusedQuestionId]
  );

  return { handleFocusQuestion };
}
