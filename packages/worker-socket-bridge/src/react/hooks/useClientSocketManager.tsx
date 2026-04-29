"use client";

import { type ReactNode,useRef, useSyncExternalStore } from "react";

import type { SocketManager } from "../../client/socket-manager";
import { SocketManagerProvider } from "../SocketManagerProvider";

/**
 * 브라우저에서만 SocketManager 싱글톤을 노출한다. SSR에서는 null.
 */
export function useClientSocketManager(
  getManager: () => SocketManager
): SocketManager | null {
  const getManagerRef = useRef(getManager);
  getManagerRef.current = getManager;

  return useSyncExternalStore(
    () => () => {},
    () => getManagerRef.current(),
    () => null
  );
}

type ClientSocketManagerProviderProps = {
  getManager: () => SocketManager;
  lifecycle?: ReactNode;
  children: ReactNode;
};

export function ClientSocketManagerProvider({
  getManager,
  lifecycle,
  children,
}: ClientSocketManagerProviderProps) {
  const manager = useClientSocketManager(getManager);

  if (!manager) {
    return <>{children}</>;
  }

  return (
    <SocketManagerProvider manager={manager}>
      {lifecycle}
      {children}
    </SocketManagerProvider>
  );
}
