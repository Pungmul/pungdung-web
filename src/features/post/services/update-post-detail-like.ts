import type { PostArticleDetail, PostLikeSnapshot } from "../types";

export function updatePostDetailLike(
  oldData: PostArticleDetail | null | undefined,
  data: PostLikeSnapshot
): PostArticleDetail | null | undefined {
  if (!oldData) {
    return oldData;
  }

  return {
    ...oldData,
    likedNum: data.likedNum,
    isLiked: data.liked,
  };
}
