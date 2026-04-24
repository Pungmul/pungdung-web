"use client";

import { useQuery } from "@tanstack/react-query";

import { SocketProvider } from "@/core";
import { authQueries } from "@/features/auth/queries";

export function AuthenticatedSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: token } = useQuery(authQueries.token());

  return (
    <SocketProvider accessToken={token?.accessToken ?? null}>
      {children}
    </SocketProvider>
  );
}
