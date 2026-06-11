import { clientApiRequest } from "@/core/api/client";

import { commentMutationResponseDtoSchema } from "./dto.schema";

export const deleteComment = async (commentId: number) => {
  return clientApiRequest({
    url: `/api/comments/${commentId}`,
    method: "DELETE",
    responseSchema: commentMutationResponseDtoSchema,
  });
};
