/** 무한 스크롤 응답에서 `pages[].list`만 이어붙입니다 (TanStack Query `InfiniteData`와 구조 호환). */
export function flattenInfinitePages<T>(
  data: { pages: Array<{ list: T[] }> } | undefined
): T[] {
  return data?.pages.flatMap((page) => page.list) ?? [];
}
