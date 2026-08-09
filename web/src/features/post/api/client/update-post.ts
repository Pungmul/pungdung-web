import { clientApiRequest } from "@/core/api/client";

import { updatePostResponseDtoSchema } from "./dto.schema";

export interface UpdatePostParams {
  postId: number;
  formData: FormData;
}

export const updatePost = async ({ postId, formData }: UpdatePostParams) =>
  clientApiRequest({
    url: `/api/posts/${postId}`,
    method: "PATCH",
    body: formData,
    responseSchema: updatePostResponseDtoSchema,
  });
