import { buildFriendsPageProfileOpenPayload } from "./build-friends-page-profile-open-payload";
import type { FriendItem, FriendsPageProfileTab } from "../types";

import { userProfileModalStore } from "@/features/user/store";

export function openFriendsPageUserProfile(
  profileTab: FriendsPageProfileTab,
  row: FriendItem
) {
  userProfileModalStore
    .getState()
    .open(buildFriendsPageProfileOpenPayload(profileTab, row));
}
