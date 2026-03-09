import { create } from "zustand";

interface ChatRoomState {
  focusingRoomId: string | null;
  setFocusingRoomId: (roomId: string | null) => void;
}

export const useChatRoomStore = create<ChatRoomState>()((set) => ({
  focusingRoomId: null,
  setFocusingRoomId: (roomId) => {
    set({ focusingRoomId: roomId });
  },
}));
