import { cookies } from "next/headers";

import { RoomContainer } from "@/features/chat";

import { ChatsLayoutBoundary } from "./_ChatsLayoutBoundary";

import { TokenProvider } from "@/features/auth/providers";

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("accessToken")?.value;

  return (
    <ChatsLayoutBoundary>
      <TokenProvider token={token}>
        <RoomContainer>{children}</RoomContainer>
      </TokenProvider>
    </ChatsLayoutBoundary>
  );
}
