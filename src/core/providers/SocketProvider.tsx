"use client";

import { useInitSocketConnect } from "../socket/hooks/useInitSocketConnect";

type SocketProviderProps = {
  accessToken?: string | null;
  children: React.ReactNode;
};

export function SocketProvider({ accessToken, children }: SocketProviderProps) {
  useInitSocketConnect(accessToken);
  return <>{children}</>;
}
