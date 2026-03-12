"use client";

import React from "react";
import Image from "next/image";

import type { User } from "@/features/user";

import { buildDisplayFriendSubtitle } from "../../services";
import type { FriendRequestInfo } from "../../types";

/** 친구 검색 기록·검색 결과 한 줄 — 프로필 열기만 (관계 액션은 프로필 모달에서 처리) */
export type FriendResultItemProps = {
  user: User;
  friendRequestInfo: FriendRequestInfo;
  onOpenProfile: (user: User, friendRequestInfo: FriendRequestInfo) => void;
  onKeyDown: (
    event: React.KeyboardEvent<HTMLDivElement>,
    user: User,
    friendRequestInfo: FriendRequestInfo
  ) => void;
};

const FriendResultItem: React.FC<FriendResultItemProps> = ({
  user,
  friendRequestInfo,
  onOpenProfile,
  onKeyDown,
}) => {
  const subtitle = buildDisplayFriendSubtitle(user);
  return (
    <div className="flex w-full min-w-0 flex-row items-center justify-between gap-2">
      <div
        className="flex min-w-0 flex-1 cursor-pointer flex-row items-center gap-4"
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onOpenProfile(user, friendRequestInfo);
        }}
        onKeyDown={(event) => onKeyDown(event, user, friendRequestInfo)}
      >
        <div className="w-12 h-12 shrink-0 bg-grey-200 relative aspect-square overflow-hidden rounded-[8px]">
          <Image
            src={user.profileImage.fullFilePath}
            alt={user.profileImage.originalFilename}
            fill
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex min-w-0 flex-grow flex-col gap-0.5 justify-center">
          <div className="text-[13px] font-medium text-grey-800">{user.name}</div>
          {Boolean(subtitle) && <div className="truncate text-[11px] text-grey-400">{subtitle}</div>}
          <div className="truncate text-[11px] text-grey-400">{user.username}</div>
        </div>
      </div>
    </div>
  );
};

export default FriendResultItem;
