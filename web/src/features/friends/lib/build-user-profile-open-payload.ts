import type { User } from "@/features/user";

import { mapFriendStatusToProfileRelationship } from "./friend-status";
import { fetchFriendsSearch } from "../api/client";

import type { OpenUserProfilePayload } from "@/features/user/types";

/** 채팅 멤버 등 검색 결과 없이 열 때, 친구 검색 API로 관계를 보강한다. */
export async function buildUserProfileOpenPayload(
  user: User
): Promise<OpenUserProfilePayload> {
  const list = await fetchFriendsSearch(user.username);
  const hit = list.find((row) => row.user.userId === user.userId);

  if (!hit) {
    return { user, relationship: "none" };
  }

  return {
    user: hit.user,
    relationship: mapFriendStatusToProfileRelationship(
      hit.friendRequestInfo.friendStatus
    ),
    incomingFriendRequestId: hit.friendRequestInfo.friendRequestId,
  };
}
