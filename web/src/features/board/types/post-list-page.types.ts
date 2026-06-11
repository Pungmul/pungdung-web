import type { PostSummary } from "@/features/post";

/** 페이징 메타가 포함된 게시글 목록 페이지 */
export interface PostListPage {
  total: number;
  list: PostSummary[];
  pageNum: number;
  pageSize: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/** 무한 스크롤 목록에서 `pages`만 사용할 때의 최소 형태(TanStack Query `InfiniteData`와 구조 호환). */
export interface InfinitePostListPages {
  pages: PostListPage[];
}
