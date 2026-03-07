"use client";
import React from "react";
import Image from "next/image";

import { ClockIcon, TrashIcon } from "@heroicons/react/24/outline";

import type { User } from "@/features/user";

import { SearchInput, Space, Spinner } from "@/shared";
import { userProfileModalStore } from "@/shared/store";

import {
  useAcceptFriendMutation,
  useFindFriends,
  useRequestFriendMutation,
} from "../../../queries";
import { friendStore } from "../../../store";
import type { FriendRequestInfo, FriendSearchHistoryEntry } from "../../../types";

function mapFriendStatusToRelationship(
  info: FriendRequestInfo
): "none" | "pending_out" | "pending_in" | "friend" {
  switch (info.friendStatus) {
    case "ACCEPTED":
      return "friend";
    case "SEND":
      return "pending_out";
    case "RECEIVE":
      return "pending_in";
    default:
      return "none";
  }
}

const FindFriendPanel: React.FC = () => {
  const { data: foundList, isLoading } = useFindFriends();
  const { mutate: requestFriend } = useRequestFriendMutation();
  const { mutate: acceptFriend } = useAcceptFriendMutation();
  const searchKeyword = friendStore((state) => state.friendsFilter.keyword);
  const searchHistory = friendStore((state) => state.searchHistory);
  const {
    setSearchKeyword,
    addSearchHistory,
    deleteSearchHistory,
  } = friendStore.getState();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleFriendSelect = React.useCallback(
    (user: User, friendRequestInfo: FriendRequestInfo) => {
      addSearchHistory({ type: "user", user });
      userProfileModalStore.getState().open({
        user,
        relationship: mapFriendStatusToRelationship(friendRequestInfo),
        incomingFriendRequestId: friendRequestInfo.friendRequestId,
      });
    },
    [addSearchHistory]
  );

  const handleHistoryDelete = React.useCallback(
    (entryId: FriendSearchHistoryEntry["id"]) => {
      deleteSearchHistory(entryId);
    },
    [deleteSearchHistory]
  );

  const handleFriendKeyDown = React.useCallback(
    (
      event: React.KeyboardEvent<HTMLDivElement>,
      user: User,
      friendRequestInfo: FriendRequestInfo
    ) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        addSearchHistory({ type: "user", user });
        userProfileModalStore.getState().open({
          user,
          relationship: mapFriendStatusToRelationship(friendRequestInfo),
          incomingFriendRequestId: friendRequestInfo.friendRequestId,
        });
      }
    },
    [addSearchHistory]
  );

  const handleSearchInputKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addSearchHistory({ type: "keyword", keyword: searchKeyword });
      }
    },
    [addSearchHistory, searchKeyword]
  );

  const handleHistorySelect = React.useCallback(
    (entry: FriendSearchHistoryEntry) => {
      if (entry.type === "keyword") {
        setSearchKeyword(entry.keyword);
        return;
      }
      setSearchKeyword(entry.user.name);
    },
    [setSearchKeyword]
  );

  const handleRequestFriend = React.useCallback(
    (user: User) => {
      requestFriend(user.username);
    },
    [requestFriend]
  );
  const handleReceiveFriend = React.useCallback(
    (requestId: number) => {
      acceptFriend(requestId);
    },
    [acceptFriend]
  );

  const hasKeyword = searchKeyword.trim().length > 0;
  const hasResults = Boolean(foundList && foundList.length > 0);
  const hasHistory = searchHistory.length > 0;

  return (
    <section>
      <div className="w-full p-4">
        <SearchInput
          placeholder="친구를 검색하세요"
          value={searchKeyword}
          onChange={handleChange}
          onKeyDown={handleSearchInputKeyDown}
          onClose={() => setSearchKeyword("")}
        />
      </div>
      <div className="w-full min-h-[min(24rem,55dvh)] max-h-[min(24rem,55dvh)] mt-2 overflow-y-auto overscroll-y-contain touch-pan-y">
        {hasKeyword ? (
          isLoading ? (
            <div className="flex flex-col flex-grow justify-center items-center min-h-[12rem]">
              <Spinner />
            </div>
          ) : hasResults ? (
            <ul className="flex flex-col gap-2 list-none">
              {foundList!.map(({ user, friendRequestInfo }) => (
                <li key={user.userId + "friends-box"}>
                  <FriendResultItem
                    user={user}
                    friendRequestInfo={friendRequestInfo}
                    onOpenProfile={handleFriendSelect}
                    onKeyDown={handleFriendKeyDown}
                    onRequestFriend={handleRequestFriend}
                    onReceiveFriend={handleReceiveFriend}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-grey-500 px-6 py-4">
              검색 결과가 없습니다.
            </p>
          )
        ) : hasHistory ? (
          <>
            <h4 className="text-sm text-grey-500 px-4">
              <ClockIcon className="size-5 text-grey-500 inline-block mr-1" />
              검색 기록
            </h4>
            <Space h={12} />
            <ul className="flex flex-col gap-2 list-none">
              {searchHistory.map((entry) => {
                return (
                  <li
                    key={entry.id}
                    className="hover:bg-grey-100 flex h-14 px-4 items-center justify-between cursor-pointer"
                    onClick={() => handleHistorySelect(entry)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();

                        handleHistorySelect(entry);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {entry.type === "keyword" ? (
                      <span className="text-base text-grey-600 px-4">
                        {entry.keyword}
                      </span>
                    ) : (
                      <span className="flex-grow">
                        <FriendResultItem
                          user={entry.user}
                          friendRequestInfo={{
                            friendRequestId: null,
                            friendStatus: "NONE",
                          }}
                          onOpenProfile={handleFriendSelect}
                          onKeyDown={handleFriendKeyDown}
                          onRequestFriend={handleRequestFriend}
                          onReceiveFriend={handleReceiveFriend}
                        />
                      </span>
                    )}
                    <span
                      className="p-1 cursor-pointer flex-shrink-0"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleHistoryDelete(entry.id);
                      }}
                    >
                      <TrashIcon className="size-5 text-red-500" />
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p className="text-sm text-grey-500 px-6 py-4">
            검색 기록이 없습니다.
          </p>
        )}
      </div>
    </section>
  );
};

export default FindFriendPanel;

const FriendResultItem: React.FC<{
  user: User;
  friendRequestInfo: FriendRequestInfo;
  onOpenProfile: (user: User, friendRequestInfo: FriendRequestInfo) => void;
  onKeyDown: (
    event: React.KeyboardEvent<HTMLDivElement>,
    user: User,
    friendRequestInfo: FriendRequestInfo
  ) => void;
  onRequestFriend: (user: User) => void;
  onReceiveFriend: (requestId: number) => void;
}> = ({
  user,
  friendRequestInfo,
  onOpenProfile,
  onKeyDown,
  onRequestFriend,
  onReceiveFriend,
}) => {
    return (
      <div className="hover:bg-grey-100 flex h-16 py-1 px-2 flex-row items-center justify-between">
        <div
          className="flex flex-row items-center gap-4 cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => onOpenProfile(user, friendRequestInfo)}
          onKeyDown={(event) => onKeyDown(event, user, friendRequestInfo)}
        >
          <div className="w-12 h-full bg-grey-200 relative aspect-square">
            <Image
              src={user.profileImage.fullFilePath}
              alt={user.profileImage.originalFilename}
              fill
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-grow flex-col gap-1 justify-center">
            <div className="text-base font-semibold">{user.name}</div>
            <div className="text-xs text-grey-300">{user.username}</div>
          </div>
        </div>
        <div>
          {friendRequestInfo.friendStatus === "RECEIVE" ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onReceiveFriend(friendRequestInfo.friendRequestId!);
              }}
            >
              수락
            </div>
          ) : friendRequestInfo.friendStatus === "NONE" ? (
            <button
              className="text-xs items-center justify-center flex p-0.5 border border-blue-400 rounded-sm text-blue-600 hover:bg-blue-400 hover:text-white cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onRequestFriend(user);
              }}
            >
              친구 신청
            </button>
          ) : (
            <div className="text-xs items-center justify-center flex p-0.5 border border-grey-400 rounded-sm text-grey-400 hover:bg-grey-400 hover:text-white cursor-pointer">
              대기중
            </div>
          )}
        </div>
      </div>
    );
  };
