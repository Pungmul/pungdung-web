/**
 * Comment React Query 키 — `comment.mutation.ts`에서만 사용한다.
 */
const COMMENT_QUERY_ROOT = ["comment"] as const;

export const commentQueryInternal = {
  mutations: () => [...COMMENT_QUERY_ROOT, "mutation"] as const,
};
