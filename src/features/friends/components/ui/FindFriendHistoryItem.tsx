"use client";

import React from "react";

import { XMarkIcon } from "@heroicons/react/24/outline";

import type { User } from "@/features/user";

import FriendResultItem from "./FriendResultItem";
import { isKeyboardActivationKey } from "../../lib";
import type { FriendRequestInfo, SearchFriendHistoryItem } from "../../types";

export type FindFriendHistoryItemProps = {
  entry: SearchFriendHistoryItem;
  onHistorySelect: (entry: SearchFriendHistoryItem) => void;
  onHistoryDelete: (entryId: SearchFriendHistoryItem["id"]) => void;
  onOpenProfile: (user: User, friendRequestInfo: FriendRequestInfo) => void;
  onKeyDown: (
    event: React.KeyboardEvent<HTMLDivElement>,
    user: User,
    friendRequestInfo: FriendRequestInfo
  ) => void;
};

/** 검색 기록 한 줄 UI — 액션은 부모가 props로 주입 */
const FindFriendHistoryItem: React.FC<FindFriendHistoryItemProps> = ({
  entry,
  onHistorySelect,
  onHistoryDelete,
  onOpenProfile,
  onKeyDown,
}) => (
  <li
    className="flex h-14 cursor-pointer items-center gap-2 rounded-md px-2 hover:bg-grey-100"
    onClick={() => onHistorySelect(entry)}
    onKeyDown={(event) => {
      if (isKeyboardActivationKey(event.key)) {
        event.preventDefault();
        onHistorySelect(entry);
      }
    }}
    role="button"
    tabIndex={0}
  >
    {entry.type === "keyword" ? (
      <span className="min-w-0 flex-1 truncate text-base text-grey-600">
        {entry.keyword}
      </span>
    ) : (
      <div className="min-w-0 flex-1">
        <FriendResultItem
          user={entry.user}
          friendRequestInfo={entry.friendRequestInfo}
          onOpenProfile={onOpenProfile}
          onKeyDown={onKeyDown}
        />
      </div>
    )}
    <span
      className="-mr-0.5 flex shrink-0 cursor-pointer items-center justify-center rounded-md p-1 hover:bg-black/10"
      onClick={(event) => {
        event.stopPropagation();
        onHistoryDelete(entry.id);
      }}
      aria-label="기록 삭제"
    >
      <XMarkIcon className="size-5 text-grey-500" />
    </span>
  </li>
);

export default FindFriendHistoryItem;
