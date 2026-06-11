"use client";

import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import type { SocketConfig } from "@pungdung/worker-socket-bridge/protocol";

import { createAuthenticatedSocketConfig } from "@/core/config/socketConnect";

import { authQueries } from "../../queries";

export function useAuthenticatedSocketConnectConfig() {
  const queryClient = useQueryClient();

  return useCallback(async (): Promise<SocketConfig> => {
    const token = await queryClient.fetchQuery({
      ...authQueries.token(),
      staleTime: 0,
    });

    if (!token?.accessToken) {
      throw new Error("No access token available for socket reconnect");
    }

    return createAuthenticatedSocketConfig(token.accessToken);
  }, [queryClient]);
}
