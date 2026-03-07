// src/app/(main)/friends/FriendRequest.tsx
import React from "react";
import Image from "next/image";

import { Friend } from "@/features/friends";

interface FriendRequestProps {
  requests: Friend[];
  onAccept: (friendRequestId: number, friendName: string) => void;
  onReject: (friendRequestId: number, friendName: string) => void;
}

const FriendRequestButton: React.FC<FriendRequestProps> = ({
  requests,
  onAccept,
  onReject,
}) => {
  return (
    <div className="w-80">
      {requests.length > 0 ? (
        requests.map((request) => (
          <div
            key={request.friendRequestId}
            className="hover:bg-gray-100 flex h-16 py-1 px-2 flex-row items-center gap-4"
          >
            <div className="w-12 h-full bg-slate-200">
              <Image
                src={request.simpleUserDTO.profileImage.fullFilePath}
                alt={request.simpleUserDTO.profileImage.originalFilename}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-grow flex-col gap-1 justify-center">
              <div className="text-base font-semibold">
                {request.simpleUserDTO.name}
              </div>
              <div className="text-xs text-gray-300">
                {request.simpleUserDTO.username}
              </div>
            </div>
            <div
              className="text-xs items-center justify-center flex p-0.5 border border-blue-400 rounded-sm text-blue-600 hover:bg-blue-400 hover:text-white cursor-pointer"
              onClick={() =>
                onAccept(request.friendRequestId, request.simpleUserDTO.name)
              }
            >
              수락
            </div>
            <div
              className="text-xs items-center justify-center flex p-0.5 border border-red-400 rounded-sm text-red-600 hover:bg-red-400 hover:text-white cursor-pointer"
              onClick={() =>
                onReject(request.friendRequestId, request.simpleUserDTO.name)
              }
            >
              거절
            </div>
          </div>
        ))
      ) : (
        <div className="self-center">친구 신청이 없습니다ㅠㅠ</div>
      )}
    </div>
  );
};

export default FriendRequestButton;
