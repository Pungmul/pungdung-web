"use client";

import { useEffect, useRef } from "react";

import { useReadReceiptStore } from "../../../store";
import type { ChatRoom } from "../../../types/chat-room.types";

type UseHydrateReadReceiptStoreParams = {
  roomId: string;
  chatRoomData: ChatRoom | undefined;
  currentUserId: number | null;
};

/**
 * roomId 전환 시 읽음 스냅샷을 리셋하고, room query userInitReadList를 max 병합으로 hydrate한다.
 */
export function useHydrateReadReceiptStore({
  roomId,
  chatRoomData,
  currentUserId,
}: UseHydrateReadReceiptStoreParams) {
  const resetRoomSlice = useReadReceiptStore((state) => state.resetRoomSlice);
  const mergeSeed = useReadReceiptStore((state) => state.mergeSeed);
  const prevRoomIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevRoomIdRef.current !== roomId) {
      resetRoomSlice(roomId);
      prevRoomIdRef.current = roomId;
    }

    if (chatRoomData?.userInitReadList) {
      mergeSeed(roomId, chatRoomData.userInitReadList, currentUserId);
    }
  }, [
    chatRoomData?.userInitReadList,
    currentUserId,
    mergeSeed,
    resetRoomSlice,
    roomId,
  ]);
}
