"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postQueries } from "@/features/post";

import { Toast } from "@/shared/store";

import type { CreateReplyParams } from "../../api/client";
import { commentMutationOptions } from "../../queries";

export function useCreateReplyAction() {
  const queryClient = useQueryClient();

  return useMutation({
    ...commentMutationOptions.createReply(),
    onSuccess: (_data, variables: CreateReplyParams) => {
      queryClient.invalidateQueries({
        queryKey: postQueries.detailKey(variables.postId),
      });
    },
    onError: (error: Error) => {
      Toast.show({
        message: "대댓글 작성에 실패했습니다.\n" + error.message,
        type: "error",
      });
    },
  });
}
