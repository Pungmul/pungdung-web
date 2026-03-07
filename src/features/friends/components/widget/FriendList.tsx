// src/app/(main)/friends/FriendList.tsx
import React from "react";
import Image from "next/image";

import { Friend } from "@/features/friends";

interface FriendListProps {
  friends: Friend[];
  onAccept: (friendRequestId: number, friendName: string) => void;
  onReject: (friendRequestId: number, friendName: string) => void;
  onSelect?: (friendEmail: string) => void;
}

const FriendList: React.FC<FriendListProps> = ({
  friends,
  onAccept,
  onReject,
  onSelect,
}) => {
  return (
    <div className="w-full h-full overflow-y-auto max-h-[80dvh]">
      {friends?.length > 0 ? (
        friends.map((friend) => (
          <div
            key={friend.friendRequestId}
            className="hover:bg-gray-100 flex h-16 py-1 px-2 flex-row items-center gap-4"
            onClick={() => onSelect?.(friend.simpleUserDTO.username)}
          >
            <div className="w-12 h-full bg-slate-200">
              <Image
                src={friend.simpleUserDTO.profileImage.fullFilePath}
                alt={friend.simpleUserDTO.profileImage.originalFilename}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-grow flex-col gap-1 justify-center">
              <div className="text-base font-semibold">
                {friend.simpleUserDTO.name}
              </div>
              <div className="text-xs text-gray-300">
                {friend.simpleUserDTO.username}
              </div>
            </div>
            <div
              className="text-xs items-center justify-center flex p-0.5 border border-blue-400 rounded-sm text-blue-600 hover:bg-blue-400 hover:text-white cursor-pointer"
              onClick={() =>
                onAccept(friend.friendRequestId, friend.simpleUserDTO.name)
              }
            >
              수락
            </div>
            <div
              className="text-xs items-center justify-center flex p-0.5 border border-red-400 rounded-sm text-red-600 hover:bg-red-400 hover:text-white cursor-pointer"
              onClick={() =>
                onReject(friend.friendRequestId, friend.simpleUserDTO.name)
              }
            >
              거절
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center flex-grow">
          <div className="text-center">친구가 없습니다ㅠㅠ</div>
        </div>
      )}
    </div>
  );
};

export default FriendList;
