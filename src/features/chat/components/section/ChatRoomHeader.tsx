"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";

import { Header } from "@/shared/components";

type ChatRoomHeaderProps = {
  title: string;
  memberCount: number;
  onBack: () => void;
  onOpenDrawer: () => void;
};

export function ChatRoomHeader({
  title,
  memberCount,
  onBack,
  onOpenDrawer,
}: ChatRoomHeaderProps) {
  return (
    <Header
      className="shrink-0 sticky top-0 z-10 bg-background"
      title={
        <div className="flex items-center gap-2 h-full">
          <div className="text-sm lg:text-base max-w-[160px] lg:max-w-[300px] truncate">
            {title}
          </div>
          {memberCount > 1 && <div className="text-sm lg:text-base text-grey-500">{memberCount}</div>}
        </div>
      }
      onLeftClick={onBack}
      rightBtn={
        <div
          className="w-10 h-10 flex items-center justify-center cursor-pointer"
          onClick={onOpenDrawer}
        >
          <span className="flex size-6 items-center justify-center">
            <Bars3Icon className="size-full text-grey-500" />
          </span>
        </div>
      }
    />
  );
}
