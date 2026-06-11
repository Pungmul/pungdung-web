import type { PostSummaryWithCategory } from "./post-summary-with-category.types";

/** 내가 쓴 글 목록(페이지 + 업스트림 페이징 메타). */
export interface PagedMyPosts {
  total: number;
  list: PostSummaryWithCategory[];
  pageNum: number;
  pageSize: number;
  size: number;
  startRow: number;
  endRow: number;
  pages: number;
  prePage: number;
  /** 다음 페이지 번호. 없음 또는 마지막 페이지면 `0`. */
  nextPage: number;
  hasNextPage: boolean;
}
