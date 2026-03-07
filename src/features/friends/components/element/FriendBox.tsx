import Image from "next/image";

import { User } from "@/features/user";

import { cn } from "@/shared";

import FriendAcceptButton from "./FriendAcceptButton";
import FriendRejectButton from "./FriendRejectButton";

interface FriendBoxProps {
  friend: User;
  onSelect?: (friendId: number) => void;
  /** 행 클릭 시 프로필 모달 등 — `onSelect`보다 먼저 호출된다. */
  onOpen?: () => void;
  className?: string;
}

export default function FriendBox({
  friend,
  onSelect,
  onOpen,
  className,
}: FriendBoxProps) {
  return (
    <div
      key={friend.userId}
      className={cn(
        "flex h-16 p-2 flex-row items-center gap-4",
        (onOpen || onSelect) && "cursor-pointer",
        className
      )}
      onClick={() => {
        onOpen?.();
        onSelect?.(friend.userId);
      }}
    >
      <div className="size-12 bg-grey-200 overflow-hidden relative rounded-[8px]">
        <Image
          src={friend.profileImage.fullFilePath}
          alt={friend.profileImage.originalFilename}
          fill
          className="object-cover object-center"
        />
      </div>
      <div className="flex flex-grow flex-col gap-1 justify-center">
        <div className="text-base text-grey-800 font-semibold">
          {friend.name}
        </div>
        <div className="text-xs text-grey-400">{friend.username}</div>
      </div>
    </div>
  );
}

interface FriendReceivedBoxProps {
  friend: User;
  friendRequestId: number;
  onOpenProfile?: () => void;
}

export function FriendReceivedBox({
  friend,
  friendRequestId,
  onOpenProfile,
}: FriendReceivedBoxProps) {
  return (
    <div
      key={friend.userId}
      className="hover:bg-grey-100 flex h-16 flex-row items-center gap-4 px-2 py-2"
    >
      <div
        className="flex min-w-0 flex-1 cursor-pointer flex-row items-center gap-4"
        onClick={() => onOpenProfile?.()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpenProfile?.();
          }
        }}
      >
        <div className="relative size-12 shrink-0 overflow-hidden rounded-[8px] bg-grey-200">
          <Image
            src={friend.profileImage.fullFilePath}
            alt={friend.profileImage.originalFilename}
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="flex min-w-0 flex-grow flex-col justify-center gap-1">
          <div className="text-base font-semibold text-grey-800">
            {friend.name}
          </div>
          <div className="text-xs text-grey-400">{friend.username}</div>
        </div>
      </div>

      <div className="flex shrink-0 flex-row gap-2">
        <FriendAcceptButton friendRequestId={friendRequestId} />
        <FriendRejectButton friendRequestId={friendRequestId} />
      </div>
    </div>
  );
}
