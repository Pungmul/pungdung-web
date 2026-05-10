"use client";

import { useCallback } from "react";

import { useQuery } from "@tanstack/react-query";

import { buildUserProfileOpenPayload } from "@/features/friends";
import { myPageQueries } from "@/features/my-page";
import { Member, User, userProfileModalStore } from "@/features/user";

function mergeMemberIntoUserForSelfModal(roomUser: User, member: Member): User {
  return {
    ...roomUser,
    username: member.username,
    name: member.name,
    profileImage: member.profile,
    clubName: member.clubName,
  } as User;
}

/** 채팅 멤버 목록·읽음 아바타 등에서 프로필 모달을 연다. */
export function useChatMemberProfileClick() {
  const { data: myInfo } = useQuery(myPageQueries.info());

  const openChatMemberProfile = useCallback(
    async (user: User) => {
      if (!myInfo) {
        return;
      }

      if (user.username === myInfo.username) {
        userProfileModalStore.getState().open({
          user: mergeMemberIntoUserForSelfModal(user, myInfo),
          relationship: "self",
        });
        return;
      }

      const payload = await buildUserProfileOpenPayload(user);
      userProfileModalStore.getState().open(payload);
    },
    [myInfo]
  );

  return { openChatMemberProfile };
}
