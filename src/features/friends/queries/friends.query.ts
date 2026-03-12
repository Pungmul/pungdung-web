import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { friendsQueryInternal } from "./friends-query-internal";
import { fetchFriendsLoad, fetchFriendsSearch } from "../api/client";

export const friendQueries = {
  all: () => ({ queryKey: friendsQueryInternal.all() } as const),

  findFriends: (debouncedKeyword: string) =>
    queryOptions({
      queryKey: friendsQueryInternal.findFriends(debouncedKeyword),
      queryFn: () => fetchFriendsSearch(debouncedKeyword),
      /** 키워드 변경 직후에도 직전 결과를 유지해 목록이 비지 않게 함 */
      placeholderData: keepPreviousData,
    }),

  loadMyFriends: () =>
    queryOptions({
      queryKey: friendsQueryInternal.loadMyFriends(),
      queryFn: () => fetchFriendsLoad(""),
    }),
};
