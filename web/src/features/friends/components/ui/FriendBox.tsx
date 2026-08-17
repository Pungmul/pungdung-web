import Image from "next/image";

import type { ReactNode } from "react";

import type { User } from "@/features/user";

import { cn } from "@/shared";

import { buildDisplayFriendSubtitle } from "../../services";

interface FriendBoxProps {
  friend: User;
  onSelect?: (friendId: number) => void;
  onOpen?: () => void;
  className?: string;
  buttons?: ReactNode;
}

export default function FriendBox({
  friend,
  onSelect,
  onOpen,
  className,
  buttons,
}: FriendBoxProps) {
  const subtitle = buildDisplayFriendSubtitle(friend);

  const handleActivate = () => {
    onOpen?.();
    onSelect?.(friend.userId);
  };

  const hasButtons = Boolean(buttons);
  const isActivable = Boolean(onOpen || onSelect);

  const identity = (
    <>
      <div className="relative size-12 shrink-0 overflow-hidden rounded-[8px] bg-grey-200">
        <Image
          src={friend.profileImage.fullFilePath}
          alt={friend.profileImage.originalFilename}
          fill
          className="object-cover object-center"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="text-[13px] font-medium text-grey-800">{friend.name}</div>
        {Boolean(subtitle) && <div className="truncate text-[11px] text-grey-400">{subtitle}</div>}
        <div className="truncate text-[11px] text-grey-400">{friend.username}</div>
      </div>
    </>
  );

  if (hasButtons) {
    return (
      <div className={cn("flex w-full flex-row items-center gap-3 p-2", className)}>
        <button
          type="button"
          className="flex min-w-0 flex-1 flex-row items-center gap-4 text-left"
          onClick={handleActivate}
        >
          {identity}
        </button>
        <div className="flex shrink-0 flex-row items-center gap-2">
          {buttons}
        </div>
      </div>
    );
  }

  if (isActivable) {
    return (
      <button
        type="button"
        className={cn(
          "flex h-16 w-full flex-row items-center gap-4 p-2 text-left",
          className
        )}
        onClick={handleActivate}
      >
        {identity}
      </button>
    );
  }

  return (
    <div className={cn("flex h-16 flex-row items-center gap-4 p-2", className)}>
      {identity}
    </div>
  );
}
