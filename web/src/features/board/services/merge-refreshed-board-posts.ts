import type { InfiniteData } from "@tanstack/react-query";

import type { fetchPostList } from "../api/client/fetch-post-list.api";

type BoardPage = Awaited<ReturnType<typeof fetchPostList>>;
export type BoardPostData = InfiniteData<BoardPage, number>;

export const MAX_REFRESH_GAP = 30;

/** 새 목록에서 기존 첫 글이 확인된 경우에만 이전 목록과 연결한다. */
export function mergeRefreshedBoardPosts(
  freshPages: BoardPage[],
  previous: BoardPostData | undefined
): { posts: BoardPage["list"]; matched: boolean } {
  const fresh = freshPages.flatMap((page) => page.list);
  const old = previous?.pages.flatMap((page) => page.list) ?? [];
  const oldHead = old[0];
  if (!oldHead) return { posts: freshPages[0]?.list ?? [], matched: false };

  const overlap = fresh.findIndex((post) => post.postId === oldHead.postId);
  if (overlap < 0 || overlap > MAX_REFRESH_GAP) {
    return { posts: freshPages[0]?.list ?? [], matched: false };
  }

  const seen = new Set<number>();
  const posts = [...fresh, ...old].filter((post) => {
    if (seen.has(post.postId)) return false;
    seen.add(post.postId);
    return true;
  });
  return { posts, matched: true };
}

/** 정렬된 글을 서버 페이지 크기로 맞춰 다음 페이지 요청이 누락되지 않도록 한다. */
export function toBoardPostData(first: BoardPage, posts: BoardPage["list"]): BoardPostData {
  const pageSize = first.pageSize;
  const totalPages = Math.max(1, Math.ceil(first.total / pageSize));
  const pageCount = Math.max(1, Math.ceil(posts.length / pageSize));
  const pages = Array.from({ length: pageCount }, (_, index) => {
    const pageNum = index + 1;
    return {
      ...first,
      list: posts.slice(index * pageSize, pageNum * pageSize),
      pageNum,
      isFirstPage: pageNum === 1,
      isLastPage: pageNum >= totalPages,
      hasPreviousPage: pageNum > 1,
      hasNextPage: pageNum < totalPages,
      hotPost: pageNum === 1 ? first.hotPost : null,
    };
  });
  return { pages, pageParams: pages.map((page) => page.pageNum) };
}
