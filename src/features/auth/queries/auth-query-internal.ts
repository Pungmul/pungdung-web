/**
 * Auth React Query 키 — `queries/index.ts`로 공개하지 않고,
 * `auth.query.ts` / `auth.mutation.ts`에서만 import 한다.
 */
const AUTH_QUERY_ROOT = ["auth"] as const;

export const authQueryInternal = {
  all: () => [...AUTH_QUERY_ROOT],
  token: () => [...AUTH_QUERY_ROOT, "token"] as const,
};
