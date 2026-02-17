"use client";

import { useCallback } from "react";

import type { MouseEvent, RefObject } from "react";

import { Alert } from "@/shared";

import type { Comment as CommentType } from "../../types";

interface UseCommentReplyPromptParams {
  comment: CommentType;
  composerTextareaRef: RefObject<HTMLTextAreaElement | null>;
  setReplyTarget: (comment: CommentType) => void;
}

export function useCommentReplyPrompt({
  comment,
  composerTextareaRef,
  setReplyTarget,
}: UseCommentReplyPromptParams) {
  return useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      Alert.confirm({
        title: "대댓글 작성",
        message: "대댓글을 작성하시겠습니까?",
        onConfirm: () => {
          composerTextareaRef.current?.focus();
          setReplyTarget(comment);
        },
      });
    },
    [comment, composerTextareaRef, setReplyTarget]
  );
}
