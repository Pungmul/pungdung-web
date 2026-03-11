import { cookies } from "next/headers";

import { ErrorBoundary } from "@suspensive/react";

import { ChatLoadFailFallback } from "@/features/chat";

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
      <TokenProvider token={token}>{children}</TokenProvider>
    </ErrorBoundary>
  );
}
