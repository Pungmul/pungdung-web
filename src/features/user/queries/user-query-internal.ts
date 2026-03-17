/**
 * 사용자 feature React Query 키 — `user-query.ts`에서만 사용.
 */
const USER_QUERY_ROOT = ["users", "profile-info"] as const;

export const userQueryInternal = {
  all: () => [...USER_QUERY_ROOT],
  detailByUsername: (username: string) =>
    [...USER_QUERY_ROOT, username] as const,
};
