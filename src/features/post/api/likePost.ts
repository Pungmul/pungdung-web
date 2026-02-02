import { PostLikeResponse } from "../types";

export const likePost = async (postId: number): Promise<PostLikeResponse> => {
  const response = await fetch(`/api/posts/${postId}/like`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("좋아요 업데이트 실패");
  }

  const data = await response.json();

  if (postId !== data.postId) {
    throw new Error("좋아요 업데이트 실패: 잘못된 게시물");
  }

  return data;
};
