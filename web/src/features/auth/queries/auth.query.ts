import { queryOptions } from "@tanstack/react-query";

import { authQueryInternal } from "./auth-query-internal";
import {
  fetchAccessToken,
  fetchEmailExists,
  fetchPasswordChangeInfo,
} from "../api/client";

/**
 * Auth queryOptions.
 * useQuery(authQueries.token()), invalidateQueries(authQueries.all()) 등.
 */
export const authQueries = {
  /** invalidateQueries, removeQueries 할 때 넣을 값. auth 하위 쿼리 전부 대상 */
  all: () => ({ queryKey: authQueryInternal.all() } as const),

  passwordInfo: () =>
    queryOptions({
      queryKey: authQueryInternal.passwordInfo(),
      queryFn: fetchPasswordChangeInfo,
      // 카카오 연동/최초 비밀번호 설정 상태가 바뀔 수 있어 항상 최신값을 본다.
      staleTime: 0,
      refetchOnMount: "always",
    }),

  token: () =>
    queryOptions({
      queryKey: authQueryInternal.token(),
      queryFn: fetchAccessToken,
    }),

  emailExists: (email: string) =>
    queryOptions({
      queryKey: ["auth", "email-exists", email],
      queryFn: () => fetchEmailExists({ email }),
      enabled: false, // 마운트 시 확인 방지 및 이메일 입력 시 refetch 호출하여 중복 검증
      staleTime: 1000 * 10,
      gcTime: 1000 * 10,
    }),
};
