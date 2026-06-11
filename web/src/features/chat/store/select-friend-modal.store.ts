"use client";

import { createStore } from "zustand/vanilla";

export interface SelectFriendModalState {
  isModalOpen: boolean;
  openModalToSelectFriend: () => void;
  closeModal: () => void;
}

export function createSelectFriendModalStore() {
  return createStore<SelectFriendModalState>((set) => ({
    isModalOpen: false,

    openModalToSelectFriend: () => {
      set({ isModalOpen: true });
    },

    closeModal: () => {
      set({ isModalOpen: false });
    },
  }));
}

export type SelectFriendModalStore = ReturnType<
  typeof createSelectFriendModalStore
>;
