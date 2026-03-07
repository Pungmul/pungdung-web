import type { User } from "@/features/user";

import type { OpenUserProfilePayload } from "@/shared/store/userProfileModal.store";

import { findFriends } from "../api/findFriends";
import type { FriendRequestInfo } from "../types";

function mapFriendRequestToRelationship(
  info: FriendRequestInfo
): OpenUserProfilePayload["relationship"] {
  switch (info.friendStatus) {
    case "ACCEPTED":
      return "friend";
    case "SEND":
      return "pending_out";
    case "RECEIVE":
      return "pending_in";
    default:
      return "none";
  }
}

/** 채팅 멤버 등 검색 결과 없이 열 때, 친구 검색 API로 관계를 보강한다. */
export async function buildUserProfileOpenPayload(
  user: User
): Promise<OpenUserProfilePayload> {
  const list = await findFriends(user.username);
  const hit = list.find((row) => row.user.userId === user.userId);

  if (!hit) {
    return { user, relationship: "none" };
  }

  return {
    user: hit.user,
    relationship: mapFriendRequestToRelationship(hit.friendRequestInfo),
    incomingFriendRequestId: hit.friendRequestInfo.friendRequestId,
  };
}
