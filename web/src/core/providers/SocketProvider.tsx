"use client";

import { ReactNode } from "react";

import { ClientSocketManagerProvider } from "@pungdung/worker-socket-bridge/react";

import { getSocketManager } from "@/core/config/socketManager";

type SocketProviderProps = {
  /** SocketManager가 준비된 뒤 provider 안에서만 마운트되는 lifecycle 슬롯 */
  socketLifecycle?: ReactNode;
  children: ReactNode;
};

export function SocketProvider({
  socketLifecycle,
  children,
}: SocketProviderProps) {
  return (
    <ClientSocketManagerProvider
      getManager={getSocketManager}
      lifecycle={socketLifecycle}
    >
      {children}
    </ClientSocketManagerProvider>
  );
}
