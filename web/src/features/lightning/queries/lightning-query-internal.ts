/**
 * Lightning React Query 키 — `queries/index.ts`로 공개하지 않고
 * `lightning.query.ts` / `lightning.mutation.ts`에서만 사용한다.
 */
const LIGHTNING_QUERY_ROOT = ["lightning"] as const;

export const lightningQueryInternal = {
  all: () => [...LIGHTNING_QUERY_ROOT],
  lists: () => [...LIGHTNING_QUERY_ROOT, "list"] as const,
  list: (filters?: { target?: string }) =>
    filters
      ? ([...lightningQueryInternal.lists(), filters] as const)
      : lightningQueryInternal.lists(),
  data: () => [...LIGHTNING_QUERY_ROOT, "data"] as const,
  status: () => [...LIGHTNING_QUERY_ROOT, "status"] as const,
};
