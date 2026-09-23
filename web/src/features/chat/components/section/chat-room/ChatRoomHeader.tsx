"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";

import { Header } from "@/shared/components";

import { chatRoomTypeLabel, chatRoomVisibleMemberCount } from "../../../lib/chat-room/chat-room-type-label";
import type { ChatRoomType } from "../../../types";

type ChatRoomHeaderProps = {
  title: string;
  roomType: ChatRoomType;
  group: boolean;
  memberCount: number;
  onBack: () => void;
  onOpenDrawer: () => void;
};

export function ChatRoomHeader({
  title,
  roomType,
  group,
  memberCount,
  onBack,
  onOpenDrawer,
}: ChatRoomHeaderProps) {
  const typeLabel = chatRoomTypeLabel(roomType);
  const visibleMemberCount = chatRoomVisibleMemberCount(
    roomType,
    group,
    memberCount,
  );

  return (
    <Header
      className="shrink-0 sticky top-0 z-10 bg-background"
      title={
        <div className="flex h-full w-[calc(100%-112px)] min-w-0 items-center justify-center gap-1.5 px-4">
          {typeLabel ? (
            <span className="flex items-center justify-center shrink-0 rounded bg-grey-100 px-1 py-0.5">
              <span className="vertical-center text-[12px] leading-[12px] text-grey-400 align-bottom pt-0.5">
                {typeLabel}
              </span>
            </span>
          ) : null}
          <div className="min-w-0 truncate text-sm lg:text-base">{title}</div>
          {visibleMemberCount != null ? (
            <span className="shrink-0 text-sm text-grey-500 lg:text-base">
              {visibleMemberCount}
            </span>
          ) : null}
        </div>
      }
      onLeftClick={onBack}
      rightBtn={
        <button
          type="button"
          aria-label="채팅방 메뉴"
          className="flex size-10 items-center justify-center"
          onClick={onOpenDrawer}
        >
          <span className="flex size-6 items-center justify-center" aria-hidden>
            <Bars3Icon className="size-full text-grey-500" />
          </span>
        </button>
      }
    />
  );
}
