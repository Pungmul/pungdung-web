import { mutationOptions } from "@tanstack/react-query";

import { commentQueryInternal } from "./comment-query-internal";
import {
  createComment,
  createReply,
  deleteComment,
  deleteReply,
  reportComment,
} from "../api/client";

const mutationRoot = commentQueryInternal.mutations();

/** useMutation에 넘길 옵션. 캐시 무효화는 호출 측에서 처리한다. */
export const commentMutationOptions = {
  create: () =>
    mutationOptions({
      mutationKey: [...mutationRoot, "create"] as const,
      mutationFn: createComment,
    }),

  createReply: () =>
    mutationOptions({
      mutationKey: [...mutationRoot, "createReply"] as const,
      mutationFn: createReply,
    }),

  delete: () =>
    mutationOptions({
      mutationKey: [...mutationRoot, "delete"] as const,
      mutationFn: ({ commentId }: { commentId: number; postId: number }) =>
        deleteComment(commentId),
    }),

  deleteReply: () =>
    mutationOptions({
      mutationKey: [...mutationRoot, "deleteReply"] as const,
      mutationFn: ({ commentId }: { commentId: number; postId: number }) =>
        deleteReply(commentId),
    }),

  report: () =>
    mutationOptions({
      mutationKey: [...mutationRoot, "report"] as const,
      mutationFn: reportComment,
    }),
};
