"use client";

import { useEffect } from "react";

import { connectSocket, disconnectSocket } from "../lib/socketHandler";

const DEFAULT_SOCKET_URL =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? "ws://localhost:8080/ws";

/**
 * Injects socket connection config from the composition layer (e.g. auth provider).
 * Does not fetch tokens — pass `accessToken` from the caller.
 */
export function useInitSocketConnect(accessToken: string | null | undefined) {
  useEffect(() => {
    if (!accessToken) {
      disconnectSocket();
      return;
    }

    void connectSocket({
      url: DEFAULT_SOCKET_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).catch((error) => {
      console.error("웹 소켓 연결 실패:", error);
    });

    return () => {
      disconnectSocket();
    };
  }, [accessToken]);
}
