import type { User } from "@/features/user";

import type { FriendRequestInfo } from "./friend.types";

export type FriendSearchHistoryKeywordEntry = {
  id: string;
  type: "keyword";
  keyword: string;
};

export type FriendSearchHistoryUserEntry = {
  id: string;
  type: "user";
  user: User;
};

export type FriendSearchHistoryEntry =
  | FriendSearchHistoryKeywordEntry
  | FriendSearchHistoryUserEntry;

/** 목록 표시용: 유저 항목에 `friendRequestInfo`를 보강한 형태 */
export type SearchFriendHistoryItem =
  | FriendSearchHistoryKeywordEntry
  | (FriendSearchHistoryUserEntry & { friendRequestInfo: FriendRequestInfo });

export type FriendSearchHistoryInput =
  | Omit<FriendSearchHistoryKeywordEntry, "id">
  | Omit<FriendSearchHistoryUserEntry, "id">;
