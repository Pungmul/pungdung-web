import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { commentLikeResponseDtoSchema } from "./dto.schema";
import { mapCommentLikeDtoToSnapshot } from "../../lib";
import type { CommentLikeSnapshot } from "../../types";

// 대댓글도 동일 commentId로 POST
export const likeComment = (
  commentId: number
): Promise<CommentLikeSnapshot> =>
  withResponseMapper({
    context: "likeComment",
    fetchDto: () =>
      clientApiRequest({
        url: `/api/comments/${commentId}/like`,
        method: "POST",
        responseSchema: commentLikeResponseDtoSchema,
      }),
    map: mapCommentLikeDtoToSnapshot,
  });
