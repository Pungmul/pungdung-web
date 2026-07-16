import type { PostSummary } from "./post-summary.types";

import type { ImageObject } from "@/shared";

/** 상세 화면용 게시글(이미지·댓글 수·권한 플래그 포함). */
export interface PostArticleDetail extends PostSummary {
  imageList: ImageObject[];
  isLiked: boolean;
  isWriter: boolean;
  categoryId: number;
}
