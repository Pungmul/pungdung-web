import { queryOptions } from "@tanstack/react-query";

import { userQueryInternal } from "./user-query-internal";
import { fetchUserProfileCardDetailByUsername } from "../api/client/fetch-user-info-by-username.api";

const USER_QUERY_DETAIL_STALE_MS = 1000 * 60 * 2;

const root = userQueryInternal.all();

/**
 * 프로필 카드 모달(`UserProfileCardModal`)과 무효화 접두를 공유한다.
 *
 * `useQuery(userQueries.detailByUsername(username))`, `invalidateQueries(userQueries.all())` 등.
 */
export const userQueries = {
  /** invalidateQueries, removeQueries 시 프로필 카드 쿼리 전체 */
  all: () => ({ queryKey: root } as const),

  detailByUsername: (username: string) =>
    queryOptions({
      queryKey: userQueryInternal.detailByUsername(username),
      queryFn: async () => {
        const res = await fetchUserProfileCardDetailByUsername(username);
        if (res == null) {
          throw new Error("USER_PROFILE_DETAIL_FETCH_FAILED");
        }
        return res;
      },
      staleTime: USER_QUERY_DETAIL_STALE_MS,
      retry: 1,
    }),
};
