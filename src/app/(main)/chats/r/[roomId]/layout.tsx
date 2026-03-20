import { cookies } from "next/headers";

import { ErrorBoundary } from "@suspensive/react";

import { ChatLoadFailFallback, RoomContainer } from "@/features/chat";

import { TokenProvider } from "@/features/auth/providers";

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("accessToken")?.value;

  return (
    <ErrorBoundary
      fallback={ChatLoadFailFallback}
    >
      <TokenProvider token={token}>
        <RoomContainer>{children}</RoomContainer>
      </TokenProvider>
    </ErrorBoundary>
  );
}
