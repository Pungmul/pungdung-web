"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { friendQueries, normalizeFriendsLoadData } from "@/features/friends";

export const useFriendsSectionSummary = () => {
  const { data, isPending, isError } = useQuery(friendQueries.loadMyFriends());

  const { acceptedFriendList, pendingReceivedList } = useMemo(
    () => normalizeFriendsLoadData(data),
    [data]
  );

  return {
    acceptedCount: acceptedFriendList.length,
    pendingReceivedCount: pendingReceivedList.length,
    showSkeleton: isPending && data === undefined,
    isError,
  };
};
