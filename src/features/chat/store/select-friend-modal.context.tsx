"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

import { useStore } from "zustand/react";

import {
  createSelectFriendModalStore,
  type SelectFriendModalState,
  type SelectFriendModalStore,
} from "./select-friend-modal.store";
import SelectFriendsModal from "../components/overlay/chat-room/SelectFriendsModal";
import { useCreateChatRoomFromFriendEmails } from "../hooks/actions";

const SelectFriendModalStoreContext =
  createContext<SelectFriendModalStore | null>(null);

export function SelectFriendModalProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<SelectFriendModalStore | undefined>(undefined);
  if (storeRef.current === undefined) {
    storeRef.current = createSelectFriendModalStore();
  }

  return (
    <SelectFriendModalStoreContext.Provider value={storeRef.current}>
      {children}
    </SelectFriendModalStoreContext.Provider>
  );
}

export function useSelectFriendModalStore<T>(
  selector: (state: SelectFriendModalState) => T
): T {
  const store = useContext(SelectFriendModalStoreContext);
  if (!store) {
    throw new Error(
      "useSelectFriendModalStore는 SelectFriendModalProvider 안에서만 사용할 수 있습니다."
    );
  }
  return useStore(store, selector);
}

export const SelectFriendModal = () => {
  const router = useRouter();
  const { createChatRoomFromFriendEmails, isPending } =
    useCreateChatRoomFromFriendEmails();
  const closeModal = useSelectFriendModalStore((s) => s.closeModal);
  const isModalOpen = useSelectFriendModalStore((s) => s.isModalOpen);

  const handleAddChatRoom = async (friendEmails: string[]) => {
    const roomUUID = await createChatRoomFromFriendEmails(friendEmails);
    if (roomUUID) {
      closeModal();
      router.push(`/chats/r/${roomUUID}`);
    }
  };

  return (
    <SelectFriendsModal
      isOpen={isModalOpen}
      onClose={closeModal}
      isConfirmPending={isPending}
      onConfirm={handleAddChatRoom}
    />
  );
};

export const useSelectFriendModal = () => {
  const openModalToSelectFriend = useSelectFriendModalStore(
    (s) => s.openModalToSelectFriend
  );
  return { openModalToSelectFriend };
};
