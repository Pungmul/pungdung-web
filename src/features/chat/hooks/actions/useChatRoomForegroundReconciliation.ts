"use client";

import { useCallback, useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { chatQueries } from "../../queries";

const FOREGROUND_RECONCILE_THROTTLE_MS = 1_000;

type UseChatRoomForegroundReconciliationParams = {
  roomId: string;
  readSign: () => void;
};

/**
 * 백그라운드 동안 놓칠 수 있는 소켓 반영을 포어그라운드 복귀 시 서버 조회로 보정한다.
 */
export function useChatRoomForegroundReconciliation({
  roomId,
  readSign,
}: UseChatRoomForegroundReconciliationParams) {
  const queryClient = useQueryClient();
  const enteredBackgroundRef = useRef(false);
  const lastReconciledAtRef = useRef(0);

  const reconcile = useCallback(() => {
    if (!roomId || document.hidden) return;

    const now = Date.now();
    if (now - lastReconciledAtRef.current < FOREGROUND_RECONCILE_THROTTLE_MS) {
      return;
    }
    lastReconciledAtRef.current = now;

    readSign();

    void queryClient.invalidateQueries({
      queryKey: chatQueries.room(roomId).queryKey,
      exact: true,
      refetchType: "active",
    });
    void queryClient.invalidateQueries({
      queryKey: chatQueries.roomList().queryKey,
      exact: true,
      refetchType: "active",
    });
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
}
