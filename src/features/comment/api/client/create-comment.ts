import { clientApiRequest } from "@/core/api/client";

import {
  commentMutationResponseDtoSchema,
  createCommentRequestDtoSchema,
} from "./dto.schema";

export interface CreateCommentParams {
  postId: number;
  comment: string;
  anonymity: boolean;
}

export const createComment = async ({
  postId,
  comment,
  anonymity,
}: CreateCommentParams) => {
  const body = {
    content: comment,
    anonymity,
  };

  return clientApiRequest({
    url: `/api/posts/${postId}/comment`,
    method: "POST",
    body,
    requestBodySchema: createCommentRequestDtoSchema,
    responseSchema: commentMutationResponseDtoSchema,
  });
};
