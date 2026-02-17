"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postQueries } from "@/features/post";

import { Toast } from "@/shared/store";

import type { CreateCommentParams } from "../../api/client";
import { commentMutationOptions } from "../../queries";

export function useCreateCommentAction() {
  const queryClient = useQueryClient();

  return useMutation({
    ...commentMutationOptions.create(),
    onSuccess: (_data, variables: CreateCommentParams) => {
      queryClient.invalidateQueries({
        queryKey: postQueries.detailKey(variables.postId),
      });
    },
    onError: (error: Error) => {
      Toast.show({
        message: "댓글 작성에 실패했습니다.\n" + error.message,
        type: "error",
      });
    },
  });
}
