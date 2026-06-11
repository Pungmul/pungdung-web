import type { User } from "@/features/user";

/** 친구 목록·프로필 오픈 등에서 쓰는 유저 한 행 (요청 id + 유저) */
export type FriendItem = {
  friendRequestId: number;
  user: User;
};

/** `/api/friends` 로드 응답의 수락된 친구 한 행 (도메인) */
export type AcceptedFriendEntry = FriendItem;

/** 내가 보낸 대기 중 요청 한 행 */
export type PendingSentFriendEntry = FriendItem;

/** 내가 응답해야 할 받은 요청 한 행 */
export type PendingReceivedFriendEntry = FriendItem;

/** 친구 목록 로드 화면·쿼리에서 쓰는 묶음 */
export type FriendsLoadData = {
  acceptedFriendList: AcceptedFriendEntry[];
  pendingSentList: PendingSentFriendEntry[];
  pendingReceivedList: PendingReceivedFriendEntry[];
};
