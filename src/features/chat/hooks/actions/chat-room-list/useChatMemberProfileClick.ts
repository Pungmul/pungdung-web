"use client";

import { useCallback } from "react";

import { useQuery } from "@tanstack/react-query";

import { myPageQueries } from "@/features/my-page";
import { openUserProfileModal, type User } from "@/features/user";

/** 채팅 멤버 목록·읽음 아바타 등에서 프로필 모달을 연다. */
export function useChatMemberProfileClick() {
  const { data: myInfo } = useQuery(myPageQueries.info());

  const openChatMemberProfile = useCallback(
    async (user: User) => {
      await openUserProfileModal(user, myInfo);
    },
    [myInfo]
  );

  return { openChatMemberProfile };
}
