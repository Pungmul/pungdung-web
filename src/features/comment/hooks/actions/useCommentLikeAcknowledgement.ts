"use client";

import { useCallback } from "react";

import { josa } from "es-hangul";
import type { MouseEvent } from "react";

import { Alert } from "@/shared";
import { Toast } from "@/shared/store";

interface UseCommentLikeAcknowledgementParams {
  content: string;
  confirmMessage?: string;
}

export function useCommentLikeAcknowledgement({
  content,
  confirmMessage = "이 댓글을 추천하시겠습니까?",
}: UseCommentLikeAcknowledgementParams) {
  return useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      Alert.confirm({
        title: "추천",
        message: confirmMessage,
        onConfirm: () => {
          Toast.show({
            message: josa(content.substring(0, 10), "을/를") + "추천했어요",
            type: "success",
          });
        },
      });
    },
    [confirmMessage, content]
  );
}
