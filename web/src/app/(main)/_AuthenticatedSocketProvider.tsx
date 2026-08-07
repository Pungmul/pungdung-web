"use client";

import { useEffect, useRef } from "react";

import { useQuery } from "@tanstack/react-query";

import {
  useInitSocketConnect,
  useSocketConnectionState,
  useSocketForegroundReconnect,
} from "@pungdung/worker-socket-bridge/react";

import { SocketProvider } from "@/core";
import {
  createSocketBrokerError,
  isSocketReconnectReason,
  reportAppError,
} from "@/core/config/report-app-error";
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
  useReportSocketBrokerError();

  return null;
}

function useReportSocketBrokerError() {
  const connection = useSocketConnectionState();
  const lastReasonRef = useRef<string | null>(null);

  useEffect(() => {
    if (connection.phase !== "failed") {
      lastReasonRef.current = null;
      return;
    }
    const reason = connection.error;
    if (!reason || isSocketReconnectReason(reason)) {
      return;
    }
    if (lastReasonRef.current === reason) {
      return;
    }
    lastReasonRef.current = reason;
    reportAppError(createSocketBrokerError(reason), { boundary: "api" });
  }, [connection.phase, connection.error]);
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
