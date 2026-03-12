"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { normalizeFriendsLoadData } from "../../lib";
import { friendQueries } from "../../queries";
import { shouldShowFriendsPageInitialSpinner } from "../../services";

/** 친구 관리 페이지: 내 친구 목록 로드 + 화면용 리스트 정규화 */
export function useLoadFriendListsViewModel() {
  const { data, isPending, isError, refetch } = useQuery(
    friendQueries.loadMyFriends()
  );

  const lists = useMemo(() => normalizeFriendsLoadData(data), [data]);

  const showInitialSpinner = shouldShowFriendsPageInitialSpinner(
    isPending,
    data
  );

  return {
    lists,
    showInitialSpinner,
    isError,
    refetch,
  };
}
