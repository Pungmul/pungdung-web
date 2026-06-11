/**
 * Friends React Query 키 — `friends.query.ts` / `friends.mutation.ts`에서만 사용.
 */
const FRIENDS_QUERY_ROOT = ["friends"] as const;

export const friendsQueryInternal = {
  all: () => [...FRIENDS_QUERY_ROOT],
  findFriends: (debouncedKeyword: string) =>
    [...FRIENDS_QUERY_ROOT, "find", debouncedKeyword] as const,
  /** 친구 관리·채팅 초대 등 전체 목록 — 검색 키워드와 분리 (로드 API는 keyword 로 필터링 가능하나 UI에서는 미사용) */
  loadMyFriends: () => [...FRIENDS_QUERY_ROOT, "load"] as const,
};
