import Image from "next/image";

import type { ReactNode } from "react";

import type { User } from "@/features/user";

import { cn } from "@/shared";

import { buildDisplayFriendSubtitle } from "../../services";

interface FriendBoxProps {
  friend: User;
  onSelect?: (friendId: number) => void;
  /** 행 클릭 시 프로필 모달 등 — `onSelect`보다 먼저 호출된다. */
  onOpen?: () => void;
  className?: string;
  /** 우측 액션 — 클릭은 메인 영역과 분리된다. */
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

  return (
    <div
      className={cn(
        "flex flex-row items-center p-2",
        hasButtons && "w-full gap-3",
        !hasButtons && "h-16 gap-4",
        !hasButtons && (onOpen || onSelect) && "cursor-pointer",
        className
      )}
      onClick={hasButtons ? undefined : handleActivate}
    >
      <div
        role={hasButtons ? "button" : undefined}
        tabIndex={hasButtons ? 0 : undefined}
        className={cn(
          "flex min-w-0 flex-1 flex-row items-center gap-4",
          hasButtons && "outline-none",
          hasButtons && (onOpen || onSelect) && "cursor-pointer"
        )}
        onClick={hasButtons ? handleActivate : undefined}
        onKeyDown={
          hasButtons
            ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleActivate();
              }
            }
            : undefined
        }
      >
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
      </div>
      {hasButtons &&
        <div
          className="flex shrink-0 flex-row items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {buttons}
        </div>
      }
    </div>
  );
}
