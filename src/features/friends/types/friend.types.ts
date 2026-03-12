import type { User } from "@/features/user";

/** 친구 관리 페이지 상단 탭·프로필 모달 맥락 구분 */
export type FriendsPageProfileTab = "friends" | "sent" | "received";

export type FriendRequestInfo = {
  friendRequestId: number | null;
  friendStatus: "ACCEPTED" | "SEND" | "RECEIVE" | "NONE" | string;
};

/** 검색 등에서 유저와 친구 요청 상태를 함께 나타낼 때 */
export type FriendStatus = {
  user: User;
  friendRequestInfo: FriendRequestInfo;
};
