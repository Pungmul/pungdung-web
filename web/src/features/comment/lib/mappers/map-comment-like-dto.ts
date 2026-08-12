import { commentLikeResponseDtoSchema } from "../../api/client/dto.schema";
import type { CommentLikeSnapshot } from "../../types";

export function mapCommentLikeDtoToSnapshot(
  raw: unknown
): CommentLikeSnapshot {
  const dto = commentLikeResponseDtoSchema.parse(raw);
  return {
    commentId: dto.commentId,
    liked: dto.liked,
    likedNum: dto.likeCount,
  };
}
