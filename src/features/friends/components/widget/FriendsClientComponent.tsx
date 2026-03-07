"use client";

import React, { useCallback, useState } from "react";

import { Friend } from "@/features/friends";

import { default as FindFriends } from "./FindFriendSection";
import { default as FriendList } from "./FriendList";
import { default as FriendRequest } from "../element/FriendRequestButton";

import {
  acceptFriendRequest,
  rejectFriendRequest,
} from "@/features/friends/api";

type FriendList = Friend[];

export default function FriendsClientComponent({
  initFriendList,
  initRquestedFriendsList,
}: {
  initFriendList: FriendList;
  initRquestedFriendsList: FriendList;
}) {
  const [myFreindsList] = useState(initFriendList);
  const [myRequstedFreindsList, setRequstedFreindsList] = useState(
    initRquestedFriendsList
  );
  const [contentType, setContentType] = useState<
    "MyFriends" | "FindFriends" | "RequsetedFriends" | null
  >(null);

  const AcceptRequest = useCallback(
    async (friendRequestId: number, friendName: string) => {
      try {
        const response = await acceptFriendRequest(friendRequestId);
        if (!response) throw Error("친구 추가 실패");
        alert(`${friendName}님과 친구가 됐어요`);
        const newList = myRequstedFreindsList.filter(
          (user) => user.friendRequestId !== friendRequestId
        );
        setRequstedFreindsList(newList);
      } catch (e) {
        console.error(e);
        if (e instanceof Error) {
          alert(e.message);
        } else {
          alert("An unknown error occurred");
        }
      }
    },
    [myRequstedFreindsList]
  );

  const RejectRequest = useCallback(
    async (friendRequestId: number, friendName: string) => {
      try {
        const response = await rejectFriendRequest(friendRequestId);
        if (!response) throw Error("거절 실패");
        alert(`${friendName}님의 요청을 거절했어요`);
        const newList = myRequstedFreindsList.filter(
          (user) => user.friendRequestId !== friendRequestId
        );
        setRequstedFreindsList(newList);
      } catch (e) {
        console.error(e);
        if (e instanceof Error) {
          alert(e.message);
        } else {
          alert("An unknown error occurred");
        }
      }
    },
    [myRequstedFreindsList]
  );

  const renderContent = () => {
    switch (contentType) {
      case "FindFriends":
        return <FindFriends />;
      case "MyFriends":
        return (
          <FriendList
            friends={myFreindsList}
            onAccept={AcceptRequest}
            onReject={RejectRequest}
          />
        );
      case "RequsetedFriends":
        return (
          <FriendRequest
            requests={myRequstedFreindsList}
            onAccept={AcceptRequest}
            onReject={RejectRequest}
          />
        );
      default:
        return (
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => setContentType("MyFriends")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              내 친구 목록
            </button>
            <button
              onClick={() => setContentType("FindFriends")}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              친구 찾기
            </button>
            <button
              onClick={() => setContentType("RequsetedFriends")}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              친구 요청 목록
            </button>
          </div>
        );
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">친구 관리</h1>
      {contentType && (
        <button
          onClick={() => setContentType(null)}
          className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          뒤로 가기
        </button>
      )}
      {renderContent()}
    </div>
  );
}
