"use client";

import { useCallback } from "react";

import type { Dispatch, SetStateAction } from "react";
import type { UseFormReset } from "react-hook-form";

import { Toast } from "@/shared/store";

import { useCreateCommentAction } from "./useCreateCommentAction";
import { useCreateReplyAction } from "./useCreateReplyAction";
import type { Comment } from "../../types";
import type { CommentComposerFormValues } from "../form";

export interface UseCommentThreadSubmitActionParams {
  postId: number;
  replyTarget: Comment | null;
  setReplyTarget: Dispatch<SetStateAction<Comment | null>>;
  resetCommentInput: () => void;
  reset: UseFormReset<CommentComposerFormValues>;
}

export function useCommentThreadSubmitAction({
  postId,
  replyTarget,
  setReplyTarget,
  resetCommentInput,
  reset,
}: UseCommentThreadSubmitActionParams) {
  const { mutateAsync: createCommentAsync } = useCreateCommentAction();
  const { mutateAsync: createReplyAsync } = useCreateReplyAction();

  const submitFromComposer = useCallback(
    async ({ content, anonymity }: CommentComposerFormValues) => {
      resetCommentInput();
      reset({ content: "", anonymity });

      try {
        if (replyTarget) {
          await createReplyAsync({
            postId,
            comment: content,
            anonymity,
            parentId: replyTarget.commentId,
          });
          setReplyTarget(null);
          return;
        }

        await createCommentAsync({ postId, comment: content, anonymity });
      } catch {
        // 실패 시 토스트는 create* Action mutation onError에서 처리
      }
    },
    [
      createCommentAsync,
      createReplyAsync,
      postId,
      replyTarget,
      reset,
      resetCommentInput,
      setReplyTarget,
    ]
  );

  const submitReplyFromComposer = useCallback(
    async (values: CommentComposerFormValues) => {
      if (!replyTarget) {
        Toast.show({
          message: "답글 대상이 없습니다.",
          type: "error",
        });
        return;
      }

      await submitFromComposer(values);
    },
    [replyTarget, submitFromComposer]
  );

  return { submitFromComposer, submitReplyFromComposer };
}
