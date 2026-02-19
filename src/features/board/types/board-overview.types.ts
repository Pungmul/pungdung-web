import type { PostSummary } from "@/features/post";

import type { PostListPage } from "./post-list-page.types";

/** 게시판 상세에서 쓰는 루트/자식 카테고리 라벨 */
export interface BoardCategoryPath {
  rootCategoryName: string;
  childCategoryName: string | null;
}

/** 게시판 상세·첫 목록을 한 번에 쓰는 클라이언트 묶음 데이터 */
export interface BoardOverview {
  boardInfo: BoardCategoryPath;
  hotPost: PostSummary;
  recentPostList: PostListPage;
}
