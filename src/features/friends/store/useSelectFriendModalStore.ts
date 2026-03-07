"use client";
import { create } from "zustand";

import { createMultiChatRoom,createPersonalChatRoom } from "@/features/chat";

interface SelectFriendModalState {
  isModalOpen: boolean;
  openModalToSelectFriend: () => void;
  closeModal: () => void;
  addChatRoom: (
    friendEmails: string[],
    onSuccess: (roomUUID: string) => void
  ) => Promise<void>;
}

const createChatRoomRequest = async (friendEmails: string[]) => {
  try {
    const response =
      friendEmails.length === 1
        ? await createPersonalChatRoom({
            receiverName: friendEmails[0] || "",
          })
        : await createMultiChatRoom({
            receiverNameList: friendEmails,
          });

    const { roomUUID } = response;

    return roomUUID;
  } catch (error) {
    alert("Failed to create chat room");
    console.error("Error creating chat room:", error);
  }
};

export const useSelectFriendModalStore = create<SelectFriendModalState>(
  (set) => ({
    isModalOpen: false,

    openModalToSelectFriend: () => {
      set({ isModalOpen: true });
    },

    closeModal: () => {
      set({ isModalOpen: false });
    },

    addChatRoom: async (
      friendEmails: string[],
      onSuccess: (roomUUID: string) => void
    ) => {
      const roomUUID = await createChatRoomRequest(friendEmails);
      if (roomUUID) {
        set({ isModalOpen: false });
        onSuccess(roomUUID);
      }
    },
  })
);

