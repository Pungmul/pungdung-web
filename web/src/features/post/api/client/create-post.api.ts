import { clientApiRequest } from "@/core/api/client";

import { createPostResponseDtoSchema } from "./dto.schema";

export interface CreatePostParams {
  boardId: number;
  formData: FormData;
}

export const createPost = async ({ boardId, formData }: CreatePostParams) =>
  clientApiRequest({
    url: `/api/posts?boardId=${boardId}`,
    method: "POST",
    body: formData,
    responseSchema: createPostResponseDtoSchema,
  });
