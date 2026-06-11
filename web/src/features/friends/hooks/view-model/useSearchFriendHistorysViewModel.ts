"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import {
  buildFriendRequestInfoByUserIdMap,
  normalizeFriendsLoadData,
} from "../../lib";
import { friendQueries } from "../../queries";
import { friendStore } from "../../store";
import type { SearchFriendHistoryItem } from "../../types";

/** 친구 로드 스냅샷으로 검색 기록 항목의 `friendRequestInfo`를 보강한다. */
export function useSearchFriendHistorysViewModel(): SearchFriendHistoryItem[] {
  const { data: friendsLoadData } = useQuery(friendQueries.loadMyFriends());
  const searchHistory = friendStore((state) => state.searchHistory);

  return useMemo(() => {
    const friendsLoad = normalizeFriendsLoadData(friendsLoadData);
    const byUserId = buildFriendRequestInfoByUserIdMap(friendsLoad);
    return searchHistory.map((entry) =>
      entry.type === "keyword"
        ? entry
        : {
            ...entry,
            friendRequestInfo: byUserId.get(entry.user.userId) ?? {
              friendRequestId: null,
              friendStatus: "NONE",
            },
          }
    );
  }, [searchHistory, friendsLoadData]);
}
