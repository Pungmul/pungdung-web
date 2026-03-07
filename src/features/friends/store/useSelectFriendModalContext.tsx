"use client";
import { useRouter } from "next/navigation";

import { SelectFriendsModal } from "@/features/chat";

import { useSelectFriendModalStore } from "./useSelectFriendModalStore";

export const SelectFriendModal = () => {
  const router = useRouter();
  const { closeModal, addChatRoom } = useSelectFriendModalStore.getState();
  const isModalOpen = useSelectFriendModalStore((state) => state.isModalOpen);

  const handleAddChatRoom = async (friendEmails: string[]) => {
    await addChatRoom(friendEmails, (roomUUID) => {
      router.push(`/chats/r/${roomUUID}`);
    });
  };

  return (
    <SelectFriendsModal
      isOpen={isModalOpen}
      onClose={closeModal}
      onConfirm={handleAddChatRoom}
    />
  );
};

export const useSelectFriendModal = () => {
  const { openModalToSelectFriend } = useSelectFriendModalStore();
  return { openModalToSelectFriend };
};

