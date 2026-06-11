import type { FriendsLoadData } from "../types";

export type FriendsLoadLists = FriendsLoadData;

export const EMPTY_FRIENDS_LOAD: FriendsLoadLists = {
  acceptedFriendList: [],
  pendingReceivedList: [],
  pendingSentList: [],
};

/** `useQuery` 초기값·부분 응답에 대비해 친구 목록 페이지에서 안전하게 사용한다. */
export function normalizeFriendsLoadData(
  data: Partial<FriendsLoadLists> | undefined | null
): FriendsLoadLists {
  if (!data) {
    return { ...EMPTY_FRIENDS_LOAD };
  }
  return {
    acceptedFriendList: data.acceptedFriendList ?? [],
    pendingReceivedList: data.pendingReceivedList ?? [],
    pendingSentList: data.pendingSentList ?? [],
  };
}
