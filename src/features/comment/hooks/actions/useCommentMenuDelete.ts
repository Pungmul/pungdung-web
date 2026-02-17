"use client";

import { useCallback } from "react";

import { Alert } from "@/shared";

import {
  type DeleteCommentVariables,
  useDeleteCommentAction,
} from "./useDeleteCommentAction";

export function useCommentMenuDelete({
  commentId,
  postId,
}: DeleteCommentVariables) {
  const { mutate: deleteCommentMutation } = useDeleteCommentAction();

  return useCallback(() => {
    Alert.confirm({
      title: "삭제",
      message: "정말 삭제하시겠습니까?",
      onConfirm: () => {
        deleteCommentMutation({ commentId, postId });
      },
    });
  }, [commentId, deleteCommentMutation, postId]);
}
