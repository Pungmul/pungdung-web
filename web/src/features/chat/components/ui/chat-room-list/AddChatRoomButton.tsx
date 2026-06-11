"use client";

import { useCallback } from "react";

import {
  SelectFriendModal,
  useSelectFriendModal,
} from "../../../store/select-friend-modal.context";

export default function AddChatRoomButton() {
  const { openModalToSelectFriend } = useSelectFriendModal();

  const clickAddChatRoom = useCallback(() => {
    openModalToSelectFriend();
  }, [openModalToSelectFriend]);
  
  return (
    <>
      <div
        className="text-[16px] px-[12px] py-[8px] rounded-lg bg-primary text-background cursor-pointer"
        onClick={clickAddChatRoom}
      >
        채팅방 만들기
      </div>
      <SelectFriendModal />
    </>
  );
}
