"use client";

import { useQuery } from "@tanstack/react-query";

import {
  useInitSocketConnect,
  useSocketForegroundReconnect,
} from "@pungdung/worker-socket-bridge/react";

import { SocketProvider } from "@/core";
import { createAuthenticatedSocketConfig } from "@/core/config/socketConnect";

import { useAuthenticatedSocketConnectConfig } from "@/features/auth/hooks/actions/useAuthenticatedSocketConnectConfig";
import { useSocketReconnectTokenRefresh } from "@/features/auth/hooks/actions/useSocketReconnectTokenRefresh";
import { authQueries } from "@/features/auth/queries";

function AuthenticatedSocketLifecycle({
  accessToken,
}: {
  accessToken: string | null;
}) {
  const resolveConnectConfig = useAuthenticatedSocketConnectConfig();

  useInitSocketConnect(accessToken, createAuthenticatedSocketConfig);
  useSocketForegroundReconnect(accessToken, createAuthenticatedSocketConfig, {
    resolveConnectConfig,
  });
  useSocketReconnectTokenRefresh();

  return null;
}

export function AuthenticatedSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: token } = useQuery(authQueries.token());
  const accessToken = token?.accessToken ?? null;

  return (
    <SocketProvider
      socketLifecycle={
        <AuthenticatedSocketLifecycle accessToken={accessToken} />
      }
    >
      {children}
    </SocketProvider>
  );
}
