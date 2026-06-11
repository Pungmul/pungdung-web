import type { FriendItem, FriendsPageProfileTab } from "../types";

import type { OpenUserProfilePayload } from "@/features/user/types";

/** 친구 관리 탭별 `userProfileModalStore.open` 페이로드. */
export function buildFriendsPageProfileOpenPayload(
  tab: FriendsPageProfileTab,
  row: FriendItem
): OpenUserProfilePayload {
  switch (tab) {
    case "friends":
      return {
        user: row.user,
        relationship: "friend",
      };
    case "sent":
      return {
        user: row.user,
        relationship: "pending_out",
      };
    case "received":
      return {
        user: row.user,
        relationship: "pending_in",
        incomingFriendRequestId: row.friendRequestId,
      };
  }
}
