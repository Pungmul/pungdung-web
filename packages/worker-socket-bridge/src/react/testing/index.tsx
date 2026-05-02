"use client";

import { createContext, type ReactNode, useContext } from "react";

import type { SocketManager } from "../../client/socket-manager";
import { NoopSocketManager } from "../../testing/noop-socket-manager";
import type { CreateSocketConnectConfig } from "../hooks/useInitSocketConnect";

/** 테스트 더블: 공개 API만 맞추고 내부 구현은 생략한다. */
const sharedNoopManager = new NoopSocketManager() as unknown as SocketManager;

const PassThrough = ({ children }: { children?: ReactNode }) => <>{children}</>;

export const SocketContext = createContext<SocketManager | undefined>(
  sharedNoopManager
);

export function SocketManagerProvider({
  children,
}: {
  manager?: SocketManager;
  children: ReactNode;
}) {
  return <SocketContext.Provider value={sharedNoopManager}>{children}</SocketContext.Provider>;
}

export function useSocketManagerOptional(): SocketManager | undefined {
  return useContext(SocketContext);
}

export function useSocketManager(manager?: SocketManager): SocketManager {
  return manager ?? useContext(SocketContext) ?? sharedNoopManager;
}

export function useClientSocketManager(
  _getManager?: () => SocketManager
): SocketManager | null {
  return sharedNoopManager as SocketManager;
}

export function ClientSocketManagerProvider({
  children,
}: {
  getManager?: () => SocketManager;
  lifecycle?: ReactNode;
  children: ReactNode;
}) {
  return <PassThrough>{children}</PassThrough>;
}

export function useInitSocketConnect(
  _accessToken?: string | null,
  _createConnectConfig?: CreateSocketConnectConfig
) {}

export function useSocketConnection() {
  return false;
}

export function useSocketConnectionState() {
  return { phase: "idle" as const, isConnected: false };
}

export function useSocketTopicsReady(_topics: readonly string[] = []) {
  return {
    isReady: false,
    statuses: [] as Array<{
      topic: string;
      status: "idle" | "pending" | "subscribed" | "error";
      error: string | undefined;
    }>,
  };
}

export function useSocketForegroundReconnect() {}

export function useSocketSubscription<T = unknown>(_params: {
  topic: string | undefined;
  onMessage: (data: T) => void;
  enabled?: boolean;
}) {
  return {
    isReady: false,
    status: "idle" as const,
    error: undefined,
  };
}

export type { CreateSocketConnectConfig };
