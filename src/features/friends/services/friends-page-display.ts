import type { FriendsLoadData, FriendsPageProfileTab } from "../types";

export function deriveFriendsPageTabCounts(
  lists: FriendsLoadData
): Record<FriendsPageProfileTab, number> {
  return {
    friends: lists.acceptedFriendList.length,
    sent: lists.pendingSentList.length,
    received: lists.pendingReceivedList.length,
  };
}

/** 첫 페치 전에만 스피너를 보여 스켈레톤/빈 화면 깜빡임을 줄인다. */
export function shouldShowFriendsPageInitialSpinner(
  isPending: boolean,
  data: unknown
): boolean {
  return isPending && data === undefined;
}
