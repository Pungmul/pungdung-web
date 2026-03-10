"use client";

import Link from "next/link";

import { ChevronRightIcon } from "@heroicons/react/24/outline";

import {
  FriendBox,
  FriendReceivedBox,
  useLoadMyFriends,
} from "@/features/friends";

import { Header, Space, UserProfileCardModalHost } from "@/shared";
import { userProfileModalStore } from "@/shared/store";

export default function FriendsPage() {
  const {
    data: { acceptedFriendList, pendingReceivedList, pendingSentList } = {
      acceptedFriendList: [],
      pendingReceivedList: [],
      pendingSentList: [],
    },
  } = useLoadMyFriends();
  return (
    <div className="bg-grey-100 h-full w-full">
      <UserProfileCardModalHost />
      <div className="flex flex-col h-full w-full min-w-[360px] max-w-[768px] mx-auto relative bg-grey-100">
        <Header title="친구 관리" />
        <Space h={12} />
        <Link
          href="/my-page/friends/find"
          className="text-grey-600 font-semibold text-base p-6 bg-background flex flex-row items-center justify-between"
        >
          <p className="text-grey-600 font-semibold text-base">친구 검색</p>
          <ChevronRightIcon className="w-4 h-4" />
        </Link>
        <main className="bg-background px-6 flex-grow flex flex-col">
          <Space h={12} />

          {pendingSentList?.length > 0 && (
            <>
              <details>
                <summary className="text-grey-600 font-semibold text-base cursor-pointer">
                  대기중인 요청{" "}
                  <span className="text-primary">
                    {pendingSentList?.length}
                  </span>
                </summary>
                <Space h={12} />
                {pendingSentList?.map((friend) => (
                  <FriendBox
                    key={friend.friendRequestId}
                    friend={friend.simpleUserDTO}
                    onOpen={() =>
                      userProfileModalStore.getState().open({
                        user: friend.simpleUserDTO,
                        relationship: "pending_out",
                      })
                    }
                  />
                ))}
              </details>
              <Space h={16} />
            </>
          )}
          {pendingReceivedList?.length > 0 && (
            <>
              <h3 className="text-grey-600 font-semibold text-base">
                친구 요청{" "}
                <span className="text-primary">
                  {pendingReceivedList?.length}
                </span>
              </h3>
              <Space h={12} />
              {pendingReceivedList?.map((friend) => (
                <FriendReceivedBox
                  key={friend.friendRequestId}
                  friend={friend.simpleUserDTO}
                  friendRequestId={friend.friendRequestId}
                  onOpenProfile={() =>
                    userProfileModalStore.getState().open({
                      user: friend.simpleUserDTO,
                      relationship: "pending_in",
                      incomingFriendRequestId: friend.friendRequestId,
                    })
                  }
                />
              ))}
              <Space h={12} />
            </>
          )}

          <h3 className="text-grey-600 font-semibold text-base">친구 목록</h3>
          <Space h={12} />
          {acceptedFriendList?.map((friend) => (
            <FriendBox
              key={friend.friendRequestId}
              friend={friend.simpleUserDTO}
              onOpen={() =>
                userProfileModalStore.getState().open({
                  user: friend.simpleUserDTO,
                  relationship: "friend",
                })
              }
            />
          ))}
        </main>
      </div>
    </div>
  );
}
