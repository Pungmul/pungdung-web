import { clientApiRequest } from "@/core/api/client";

import {
  commentMutationResponseDtoSchema,
  createReplyRequestDtoSchema,
} from "./dto.schema";

export interface CreateReplyParams {
  postId: number;
  comment: string;
  parentId: number;
  anonymity: boolean;
}

export const createReply = async ({
  postId,
  comment,
  parentId,
  anonymity,
}: CreateReplyParams) => {
  const body = {
    content: comment,
    parentId,
    anonymity,
  };

  return clientApiRequest({
    url: `/api/posts/${postId}/comment`,
    method: "POST",
    body,
    requestBodySchema: createReplyRequestDtoSchema,
    responseSchema: commentMutationResponseDtoSchema,
  });
};
