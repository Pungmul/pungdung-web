"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postMutationOptions, postQueries } from "../../queries";
import { updatePostDetailLike } from "../../services";
import type { PostArticleDetail } from "../../types";

export function useLikePostAction() {
  const queryClient = useQueryClient();

  return useMutation({
    ...postMutationOptions.like(),
    onSuccess: (data, postId) => {
      queryClient.setQueryData(
        postQueries.detailKey(postId),
        (oldData: PostArticleDetail | null | undefined) =>
          updatePostDetailLike(oldData, data)
      );
      void queryClient.invalidateQueries({
        queryKey: postQueries.lists(),
      });
    },
  });
}
