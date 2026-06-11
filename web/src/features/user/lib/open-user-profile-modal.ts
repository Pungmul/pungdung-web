import { buildUserProfileOpenPayload } from "@/features/friends";

import { userProfileModalStore } from "../store";

import type { Member, User } from "../types";

export function mergeMemberIntoUserForSelfModal(
  roomUser: User,
  member: Member
): User {
  return {
    ...roomUser,
    username: member.username,
    name: member.name,
    profileImage: member.profile,
    clubName: member.clubName,
    groupName: member.groupName,
  } as User;
}

/** 본인/타인 분기 후 프로필 카드 모달을 연다. `myInfo`가 없으면 아무 것도 하지 않는다. */
export async function openUserProfileModal(
  user: User,
  myInfo: Member | undefined
): Promise<void> {
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
}
