"use client";

import { useCallback, useEffect, useRef } from "react";

import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { chatQueries } from "../../../queries";
import {
  applyChatRoomGapMessagesToChatRoom,
  applyChatRoomGapMessagesToRoomInfinite,
  applyChatRoomGapMessagesToRoomList,
  fetchChatRoomMessageGap,
} from "../../../services";
import type { ChatLogCursorPage, ChatRoom } from "../../../types";

const FOREGROUND_RECONCILE_THROTTLE_MS = 1_000;

type UseChatRoomForegroundReconciliationParams = {
  roomId: string;
  readSign: () => void;
  isConnected: boolean;
};

/**
 * 백그라운드·reconnect 동안 놓친 소켓 메시지를 REST 역방향 조회로 보정한다.
 */
export function useChatRoomForegroundReconciliation({
  roomId,
  readSign,
  isConnected,
}: UseChatRoomForegroundReconciliationParams) {
  const queryClient = useQueryClient();
  const enteredBackgroundRef = useRef(false);
  const wasDisconnectedRef = useRef(!isConnected);
  const lastReconciledAtRef = useRef(0);
  const reconcileInFlightRef = useRef(false);

  const reconcile = useCallback(() => {
    if (!roomId || document.hidden || reconcileInFlightRef.current) {
      return;
    }

    const now = Date.now();
    if (now - lastReconciledAtRef.current < FOREGROUND_RECONCILE_THROTTLE_MS) {
      return;
    }
    lastReconciledAtRef.current = now;
    reconcileInFlightRef.current = true;

    void (async () => {
      try {
        const gapMessages = await fetchChatRoomMessageGap(roomId);
        if (gapMessages.length > 0) {
          queryClient.setQueryData<ChatRoom>(
            chatQueries.room(roomId).queryKey,
            (prev) =>
              applyChatRoomGapMessagesToChatRoom(prev, gapMessages) ?? prev
          );

          queryClient.setQueryData<InfiniteData<ChatLogCursorPage>>(
            chatQueries.roomInfinite(roomId).queryKey,
            (prev) => applyChatRoomGapMessagesToRoomInfinite(prev, gapMessages)
          );

          queryClient.setQueryData(
            chatQueries.roomList().queryKey,
            (prev) =>
              applyChatRoomGapMessagesToRoomList(prev, roomId, gapMessages)
          );
        }

        readSign();
      } finally {
        reconcileInFlightRef.current = false;
      }
    })();
  }, [queryClient, readSign, roomId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        enteredBackgroundRef.current = true;
        return;
      }

      if (!enteredBackgroundRef.current) return;
      enteredBackgroundRef.current = false;
      reconcile();
    };

    const handlePageHide = () => {
      enteredBackgroundRef.current = true;
    };

    const handlePageShow = () => {
      if (!enteredBackgroundRef.current) return;
      enteredBackgroundRef.current = false;
      reconcile();
    };

    const handleOnline = () => {
      reconcile();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("online", handleOnline);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("online", handleOnline);
    };
  }, [reconcile]);

  useEffect(() => {
    if (!isConnected) {
      wasDisconnectedRef.current = true;
      return;
    }

    if (!wasDisconnectedRef.current) {
      return;
    }

    wasDisconnectedRef.current = false;
    reconcile();
  }, [isConnected, reconcile]);
}
