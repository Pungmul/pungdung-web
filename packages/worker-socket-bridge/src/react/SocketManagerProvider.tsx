"use client";

import {
  createContext,
  type ReactNode,
  useContext,
} from "react";

import type { SocketManager } from "../client/socket-manager";

export const SocketContext = createContext<SocketManager | undefined>(
  undefined
);

type SocketManagerProviderProps = {
  manager: SocketManager;
  children: ReactNode;
};

export function SocketManagerProvider({
  manager,
  children,
}: SocketManagerProviderProps) {
  return (
    <SocketContext.Provider value={manager}>{children}</SocketContext.Provider>
  );
}

export function useSocketManagerOptional(): SocketManager | undefined {
  return useContext(SocketContext);
}

export function useSocketManager(manager?: SocketManager): SocketManager {
  const contextManager = useSocketManagerOptional();

  if (manager) {
    return manager;
  }

  if (!contextManager) {
    throw new Error(
      "No SocketManager set, use SocketManagerProvider to set one"
    );
  }

  return contextManager;
}
