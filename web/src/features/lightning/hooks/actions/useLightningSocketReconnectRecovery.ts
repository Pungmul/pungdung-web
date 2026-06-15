"use client";

import { useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useSocketConnection } from "@pungdung/worker-socket-bridge/react";

import { lightningQueries } from "../../queries";

/**
 * reconnect 동안 놓친 STOMP delta를 HTTP로 보정한다.
 * 소켓 이벤트 처리와 달리 연결 복구 시에만 search/status를 refetch한다.
 */
export function useLightningSocketReconnectRecovery() {
  const queryClient = useQueryClient();
  const isConnected = useSocketConnection();
  const wasDisconnectedRef = useRef(!isConnected);

  useEffect(() => {
    if (!isConnected) {
      wasDisconnectedRef.current = true;
      return;
    }

    if (!wasDisconnectedRef.current) {
      return;
    }

    wasDisconnectedRef.current = false;

    void queryClient.invalidateQueries(lightningQueries.lightningData());
    void queryClient.invalidateQueries(lightningQueries.participationStatus());
  }, [isConnected, queryClient]);
}
