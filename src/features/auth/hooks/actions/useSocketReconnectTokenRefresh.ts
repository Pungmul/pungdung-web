"use client";

import { useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";

import {
  useSocketConnectionState,
  useSocketManager,
} from "@pungdung/worker-socket-bridge/react";

import { authQueries } from "../../queries";

/**
 * After a reconnect attempt fails (reconnecting → failed), refresh session cookies
 * via GET /api/auth/token and let AuthenticatedSocketProvider reconnect with the new access token.
 */
export function useSocketReconnectTokenRefresh() {
  const socket = useSocketManager();
  const queryClient = useQueryClient();
  const { phase } = useSocketConnectionState();
  const previousPhaseRef = useRef(phase);

  useEffect(() => {
    const previousPhase = previousPhaseRef.current;
    previousPhaseRef.current = phase;

    if (previousPhase !== "reconnecting" || phase !== "failed") {
      return;
    }

    void queryClient
      .fetchQuery({
        ...authQueries.token(),
        staleTime: 0,
      })
      .catch(() => {
        socket.disconnect();
      });
  }, [phase, queryClient, socket]);
}
