"use client";

import React from "react";

import { XMarkIcon } from "@heroicons/react/24/outline";

import type { User } from "@/features/user";

import FriendResultItem from "./FriendResultItem";
import type { FriendRequestInfo, SearchFriendHistoryItem } from "../../types";

export type FindFriendHistoryItemProps = {
  entry: SearchFriendHistoryItem;
  onHistorySelect: (entry: SearchFriendHistoryItem) => void;
  onHistoryDelete: (entryId: SearchFriendHistoryItem["id"]) => void;
  onOpenProfile: (user: User, friendRequestInfo: FriendRequestInfo) => void;
};

const FindFriendHistoryItem: React.FC<FindFriendHistoryItemProps> = ({
  entry,
  onHistorySelect,
  onHistoryDelete,
  onOpenProfile,
}) => (
  <li className="flex h-14 items-center gap-2 rounded-md px-2 hover:bg-grey-100">
    {entry.type === "keyword" ? (
      <button
        type="button"
        className="min-w-0 flex-1 truncate text-left text-base text-grey-600"
        onClick={() => onHistorySelect(entry)}
      >
        {entry.keyword}
      </button>
    ) : (
      <div className="min-w-0 flex-1">
        <FriendResultItem
          user={entry.user}
          friendRequestInfo={entry.friendRequestInfo}
          onOpenProfile={onOpenProfile}
        />
      </div>
    )}
    <button
      type="button"
      aria-label="기록 삭제"
      className="-mr-0.5 flex shrink-0 items-center justify-center rounded-md p-1 hover:bg-black/10"
      onClick={() => {
        onHistoryDelete(entry.id);
      }}
    >
      <span className="flex size-5 items-center justify-center" aria-hidden>
        <XMarkIcon className="size-full text-grey-500" />
      </span>
    </button>
  </li>
);

export default FindFriendHistoryItem;
