import { clientApiRequest } from "@/core/api/client";

import { deletePostResponseDtoSchema } from "./dto.schema";

export interface DeletePostParams {
  postId: number;
}

export const deletePost = async ({ postId }: DeletePostParams) =>
  clientApiRequest({
    url: `/api/posts/${postId}`,
    method: "DELETE",
    responseSchema: deletePostResponseDtoSchema,
  });
