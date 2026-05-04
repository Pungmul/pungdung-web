"use client";

import { useEffect } from "react";

import { useResetRoomUnreadCount } from "./useResetRoomUnreadCount";
import { useChatRoomStore } from "../../store/chat-room.store";

/** 현재 보고 있는 방 ID를 스토어에 반영하고, 해당 방의 미읽음 카운트를 리스트 캐시에서 초기화합니다. */
export function useSyncChatRoomFocusOnRoomId(roomId: string) {
  const setFocusingRoomId = useChatRoomStore((s) => s.setFocusingRoomId);
  const { resetRoomUnreadCount } = useResetRoomUnreadCount();

  useEffect(() => {
    setFocusingRoomId(roomId);
    resetRoomUnreadCount(roomId);

    return () => {
      if (useChatRoomStore.getState().focusingRoomId !== roomId) return;
      setFocusingRoomId(null);
    };
  }, [roomId, resetRoomUnreadCount, setFocusingRoomId]);
}
