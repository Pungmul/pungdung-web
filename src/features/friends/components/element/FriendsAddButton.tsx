"use client";

import React, { useMemo } from "react";

import { debounce } from "lodash";

import { requestFriend } from "@/features/friends/api";

function FriendsAddButton({
  friendName,
  friendId,
}: {
  friendName: string;
  friendId: string;
}) {
  const FriendRequset = useMemo(
    () =>
      debounce(async (friendName: string, freindId: string) => {
        try {
          const response = await requestFriend(freindId);
          if (!response) throw Error("친구 추가 실패");
          alert(`${friendName}님께 친구를 신청했어요`);
        } catch (e: unknown) {
          console.error(e);
          if (e instanceof Error) {
            alert(e.message);
          } else {
            alert("An unknown error occurred");
          }
        }
      }, 300),
    []
  );

  return (
    <div
      className=" text-xs items-center justify-center flex  border border-blue-400 rounded-sm text-blue-600 hover:bg-blue-400 hover:text-white cursor-pointer"
      onClick={() => FriendRequset(friendName, friendId)}
    >
      친구 추가
    </div>
  );
}

export default FriendsAddButton;
