import type { FriendRequestInfo, FriendsLoadData } from "../types";

/**
 * 친구 로드 목록을 `userId` → `FriendRequestInfo`로 한 번만 펼친다.
 * 우선순위: 수락됨(ACCEPTED) → 받은 요청(RECEIVE) → 보낸 요청(SEND).
 */
export function buildFriendRequestInfoByUserIdMap(
  load: FriendsLoadData
): Map<number, FriendRequestInfo> {
  const map = new Map<number, FriendRequestInfo>();
  for (const row of load.acceptedFriendList) {
    map.set(row.user.userId, {
      friendRequestId: row.friendRequestId,
      friendStatus: "ACCEPTED",
    });
  }
  for (const row of load.pendingReceivedList) {
    if (!map.has(row.user.userId)) {
      map.set(row.user.userId, {
        friendRequestId: row.friendRequestId,
        friendStatus: "RECEIVE",
      });
    }
  }
  for (const row of load.pendingSentList) {
    if (!map.has(row.user.userId)) {
      map.set(row.user.userId, {
        friendRequestId: row.friendRequestId,
        friendStatus: "SEND",
      });
    }
  }
  return map;
}

const noneFriendRequestInfo: FriendRequestInfo = {
  friendRequestId: null,
  friendStatus: "NONE",
};

/**
 * `/api/friends/load` 도메인 묶음에서 특정 유저와의 관계를 `FriendRequestInfo`로 맞춘다.
 * 검색 기록 등 검색 API를 다시 치지 않고도 버튼·배지 상태를 맞출 때 사용한다.
 */
export function resolveFriendRequestInfoFromFriendsLoad(
  userId: number,
  load: FriendsLoadData
): FriendRequestInfo {
  return (
    buildFriendRequestInfoByUserIdMap(load).get(userId) ?? noneFriendRequestInfo
  );
}
