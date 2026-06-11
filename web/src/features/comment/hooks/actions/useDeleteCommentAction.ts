"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postQueries } from "@/features/post";

import { Toast } from "@/shared/store";

import { commentMutationOptions } from "../../queries";

export interface DeleteCommentVariables {
  commentId: number;
  postId: number;
}

export function useDeleteCommentAction() {
  const queryClient = useQueryClient();

  return useMutation({
    ...commentMutationOptions.delete(),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: postQueries.detailKey(variables.postId),
      });
      Toast.show({ message: "삭제되었습니다.", type: "success" });
    },
    onError: (error: Error) => {
      Toast.show({
        message: "삭제에 실패했습니다.\n" + error.message,
        type: "error",
      });
    },
  });
}
