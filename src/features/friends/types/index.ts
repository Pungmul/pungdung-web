import type { User } from "@/features/user";

export interface Friend {
  friendRequestId: number;
  friendStatus: string;
  simpleUserDTO: User;
  isRequestSentByUser: boolean;
}

export type FriendRequestInfo = {
  friendRequestId: number | null;
  friendStatus: "ACCEPTED" | "SEND" | "RECEIVE" | "NONE" | string;
};

export type FriendStatus = {
  user: User;
  friendRequestInfo: FriendRequestInfo;
};

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

export type FriendSearchHistoryInput =
  | Omit<FriendSearchHistoryKeywordEntry, "id">
  | Omit<FriendSearchHistoryUserEntry, "id">;


