import type { ImageObject } from "@/shared";

/** 목록·카드에 쓰이는 게시글 한 줄(요약). */
export interface PostSummary {
  postId: number;
  title: string;
  content: string;
  thumbnail: ImageObject | null;
  imageNum: number;
  viewCount: number;
  likedNum: number;
  commentNum: number;
  timeSincePosted: number;
  timeSincePostedText: string;
  /** 목록 API에 있으면 상대 시각을 `getTimeSincePosted`로 통일할 때 우선 사용 */
  createdAt?: string;
  author: string;
}
