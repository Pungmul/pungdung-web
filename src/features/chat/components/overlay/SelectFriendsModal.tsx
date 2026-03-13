"use client";
import { useCallback, useState } from "react";
import Link from "next/link";

import { useQuery } from "@tanstack/react-query";

import {
  type AcceptedFriendEntry,
  FriendBox,
  friendQueries,
} from "@/features/friends";

import { cn } from "@/shared";
import { Button, Modal, SearchInput, Spinner } from "@/shared/components";

import { friendStore } from "@/features/friends/store";

const SelectFriendsModal = ({
  onConfirm,
  isOpen,
  onClose,
}: {
  onConfirm: (friendEmails: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const setSearchKeyword = friendStore((state) => state.setSearchKeyword);
  const searchKeyword = friendStore((state) => state.friendsFilter.keyword);
  const { data: friends } = useQuery(friendQueries.loadMyFriends());

  const [selectedFriends, setSelectedFriends] = useState<AcceptedFriendEntry[]>(
    []
  );

  const handleSelect = (friendId: number) => {
    if (
      selectedFriends.some(
        (friend: AcceptedFriendEntry) => friend.user.userId === friendId
      )
    ) {
      setSelectedFriends((prev) =>
        prev.filter(
          (friend: AcceptedFriendEntry) => friend.user.userId !== friendId
        )
      );
    } else {
      setSelectedFriends((prev) => [
        ...prev,
        friends!.acceptedFriendList.find(
          (friend: AcceptedFriendEntry) => friend.user.userId === friendId
        )!,
      ]);
    }
  };

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleClose = useCallback(() => {
    onClose();
    setSelectedFriends([]);
  }, [onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="대화상대 선택"
      style={{ height: "80dvh" }}
      className="w-[80vw] max-w-[600px]"
    >
      <div className="flex flex-col gap-[16px] w-full h-full">
        <div className="w-full p-1">
          <SearchInput
            placeholder="친구를 검색하세요"
            value={searchKeyword}
            onChange={onChangeSearch}
            onClose={() => setSearchKeyword("")}
          />
        </div>

        <div className="flex flex-col flex-grow overflow-y-auto">
          {friends ? (
            friends.acceptedFriendList.map((friend: AcceptedFriendEntry) => (
              <FriendBox
                key={friend.user.userId}
                friend={friend.user}
                onSelect={handleSelect}
                className={
                  cn("cursor-pointer p-3",
                    selectedFriends.some((f) => f.user.userId === friend.user.userId)
                      ? "bg-red-100"
                      : ""
                  )
                }
              />
            ))
          ) : (
            <div className="flex flex-col flex-grow justify-center items-center">
              <Spinner />
            </div>
          )}
        </div>
        {(
          <Button
            type="button"
            disabled={selectedFriends.length < 1}
            onClick={(e) => {
              e.preventDefault();
              onConfirm(
                selectedFriends.map((friend) => friend.user.username)
              );
              handleClose();
            }}
          >
            완료
          </Button>
        )}
        <Link href="/my-page/friends" className="px-1">
          <u className="text-grey-500 text-sm">친구를 새롭게 추가하시나요?</u>
        </Link>
      </div>
    </Modal>
  );
};

export default SelectFriendsModal;
