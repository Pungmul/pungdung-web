"use client";

import { useCallback } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { josa } from "es-hangul";
import type { MouseEvent } from "react";

import { Alert } from "@/shared";
import { Toast } from "@/shared/store";

import { commentMutationOptions, commentQueries } from "../../queries";

interface UseCommentLikeAcknowledgementParams {
  commentId: number;
  postId: number;
  content: string;
  confirmMessage?: string;
}

export function useCommentLikeAcknowledgement({
  commentId,
  postId,
  content,
  confirmMessage = "이 댓글을 추천하시겠습니까?",
}: UseCommentLikeAcknowledgementParams) {
  const queryClient = useQueryClient();
  const { mutate: likeComment } = useMutation({
    ...commentMutationOptions.like(),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentQueries.listKey(variables.postId),
      });
    },
    onError: (error: Error) => {
      Toast.show({
        message: "추천에 실패했습니다.\n" + error.message,
        type: "error",
      });
    },
  });

  return useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      Alert.confirm({
        title: "추천",
        message: confirmMessage,
        onConfirm: () => {
          likeComment(
            { commentId, postId },
            {
              onSuccess: () => {
                Toast.show({
                  message: josa(content.substring(0, 10), "을/를") + "추천했어요",
                  type: "success",
                });
              },
            }
          );
        },
      });
    },
    [commentId, confirmMessage, content, likeComment, postId]
  );
}
