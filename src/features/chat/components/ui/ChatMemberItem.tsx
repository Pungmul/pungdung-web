import Image from "next/image";

import { User } from "@/features/user";

import { cn } from "@/shared";

interface ChatMemberItemProps {
  user: User;
  isCurrentUser: boolean;
  onProfileClick?: (user: User) => void;
}

export const ChatMemberItem = ({
  user,
  isCurrentUser,
  onProfileClick,
}: ChatMemberItemProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center gap-[12px] px-[16px] py-[8px] hover:bg-grey-200",
        onProfileClick && "cursor-pointer"
      )}
      onClick={() => {
        onProfileClick?.(user);
      }}
    >
      {user.profileImage?.fullFilePath ? (
        <Image
          src={user.profileImage.fullFilePath}
          alt={user.username}
          width={36}
          height={36}
          className="rounded-full object-cover overflow-hidden size-[36px]"
        />
      ) : (
        <div className="size-[36px] bg-gray-300 rounded-full" />
      )}
      {isCurrentUser && (
        <div className="rounded-full bg-gray-500 size-[16px] flex items-center justify-center">
          <span className="text-[11px] font-medium text-white leading-none">
            나
          </span>
        </div>
      )}
      <div className="text-md font-medium">{user.name}</div>
    </div>
  );
};
