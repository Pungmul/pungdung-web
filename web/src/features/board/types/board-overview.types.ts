import type { HotPostBannerPost } from "./hot-post-banner.types";
import type { PostListPage } from "./post-list-page.types";

export interface BoardChildCategory {
  id: number;
  parentId: number | null;
  name: string;
  description: string | null;
}

/** 게시판 상세에서 쓰는 루트/자식 카테고리 라벨 */
export interface BoardCategoryPath {
  rootCategoryId: number;
  rootCategoryName: string;
  childCategoryName: string | null;
  isPublic: boolean;
  childCategories: BoardChildCategory[];
}

/** 게시판 상세·첫 목록을 한 번에 쓰는 클라이언트 묶음 데이터 */
export interface BoardOverview {
  currentCategoryId: number;
  boardInfo: BoardCategoryPath;
  hotPost: HotPostBannerPost | null;
  recentPostList: PostListPage;
}
