import type { BoardOverview, InfinitePostListPages } from "../types";

export const deriveBoardPostList = (
  boardData: BoardOverview | undefined,
  postListData: InfinitePostListPages | undefined
) => {
  const pageCount = postListData?.pages?.length ?? 0;

  if (pageCount > 0 && postListData) {
    const fromInfinite = postListData.pages.flatMap((page) => page.list);
    if (fromInfinite.length > 0) {
      return fromInfinite;
    }
    /* 무한 쿼리 첫 페이지만 도착했고 list가 비었을 때: 상세가 오면 그쪽 메타·목록과 맞춘다 */
    if (!boardData) {
      return [];
    }
    return boardData.recentPostList.list;
  }

  if (!boardData) {
    return [];
  }

  return boardData.recentPostList.list;
};

/** 무한 쿼리 첫 로드 전에는 `hasNextPage`가 없어 옵저버가 바로 해제되는 문제를 피하기 위해, 페이지가 비었을 때는 보드 상세의 페이징 메타를 쓴다. */
export const deriveBoardPostListHasNextPage = (
  boardData: BoardOverview | undefined,
  postListData: InfinitePostListPages | undefined,
  infiniteQueryHasNextPage: boolean | undefined
): boolean => {
  const pageCount = postListData?.pages?.length ?? 0;

  if (pageCount > 0 && postListData) {
    const fromInfinite = postListData.pages.flatMap((page) => page.list);
    if (fromInfinite.length > 0) {
      return Boolean(infiniteQueryHasNextPage);
    }
    if (!boardData) {
      return false;
    }
    return boardData.recentPostList.hasNextPage;
  }

  if (!boardData) {
    return false;
  }

  return boardData.recentPostList.hasNextPage;
};
