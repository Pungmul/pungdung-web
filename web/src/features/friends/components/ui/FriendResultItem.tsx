"use client";

import React from "react";
import Image from "next/image";

import type { User } from "@/features/user";

import { buildDisplayFriendSubtitle } from "../../services";
import type { FriendRequestInfo } from "../../types";

export type FriendResultItemProps = {
  user: User;
  friendRequestInfo: FriendRequestInfo;
  onOpenProfile: (user: User, friendRequestInfo: FriendRequestInfo) => void;
};

const FriendResultItem: React.FC<FriendResultItemProps> = ({
  user,
  friendRequestInfo,
  onOpenProfile,
}) => {
  const subtitle = buildDisplayFriendSubtitle(user);
  return (
    <div className="flex w-full min-w-0 flex-row items-center justify-between gap-2">
      <button
        type="button"
        className="flex min-w-0 flex-1 flex-row items-center gap-4 text-left"
        onClick={() => {
          onOpenProfile(user, friendRequestInfo);
        }}
      >
        <div className="w-12 h-12 shrink-0 bg-grey-200 relative aspect-square overflow-hidden rounded-[8px]">
          <Image
            src={user.profileImage.fullFilePath}
            alt={user.profileImage.originalFilename}
            fill
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex min-w-0 flex-grow flex-col justify-center">
          <div className="text-[13px] font-medium text-grey-800">{user.name}</div>
          {Boolean(subtitle) && <div className="truncate text-[11px] text-grey-400">{subtitle}</div>}
          <div className="truncate text-[11px] text-grey-400">{user.username}</div>
        </div>
      </button>
    </div>
  );
};

export default FriendResultItem;
