"use client";

import { useEffect } from "react";

import type { SocketConfig } from "../../protocol";
import { useSocketManager } from "../SocketManagerProvider";

export type CreateSocketConnectConfig = (accessToken: string) => SocketConfig;

export function useInitSocketConnect(
  accessToken: string | null | undefined,
  createConnectConfig: CreateSocketConnectConfig
) {
  const socket = useSocketManager();

  useEffect(() => {
    if (!accessToken) {
      if (socket.getConnectionStatus()) {
        socket.disconnect();
      }
      return;
    }

    void socket
      .connect(createConnectConfig(accessToken))
      .catch((error) => {
        console.error("Socket connect failed:", error);
      });
  }, [accessToken, createConnectConfig, socket]);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);
}
