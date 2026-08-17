"use client";

import { useCallback } from "react";

import type { User } from "@/features/user";

import { mapFriendStatusToProfileRelationship } from "../../lib";
import { friendStore } from "../../store";
import type { FriendRequestInfo } from "../../types";

import { userProfileModalStore } from "@/features/user/store";

// 검색 결과·검색 기록의 유저 행: 검색 기록에 남긴 뒤 프로필 모달을 염
export function useOpenProfileBySearchResultItem() {
  const { addSearchHistory } = friendStore.getState();

  const openProfile = useCallback(
    (user: User, friendRequestInfo: FriendRequestInfo) => {
      addSearchHistory({ type: "user", user });
      userProfileModalStore.getState().open({
        user,
        relationship: mapFriendStatusToProfileRelationship(
          friendRequestInfo.friendStatus
        ),
        incomingFriendRequestId: friendRequestInfo.friendRequestId,
      });
    },
    [addSearchHistory]
  );

  return {
    openProfile,
  };
}
