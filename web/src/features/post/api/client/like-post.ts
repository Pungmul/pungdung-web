import { clientApiRequest } from "@/core/api/client";

import { postLikeResponseDtoSchema } from "./dto.schema";
import type { PostLikeSnapshot } from "../../types";

export const likePost = async (postId: number): Promise<PostLikeSnapshot> =>
  clientApiRequest({
    url: `/api/posts/${postId}/like`,
    method: "POST",
    responseSchema: postLikeResponseDtoSchema,
  });
