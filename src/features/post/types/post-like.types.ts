/** 좋아요 토글 직후 API가 돌려주는 카운트/상태 한 스냅샷. */
export interface PostLikeSnapshot {
  postId: number;
  liked: boolean;
  likedNum: number;
}
