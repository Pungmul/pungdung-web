import { cookies } from "next/headers";

import { ErrorBoundary } from "react-error-boundary";

import Suspense from "@/shared/components/SuspenseComponent";

import { TokenProvider } from "@/features/auth/providers";
import { ChatLoadFailFallback } from "@/features/chat/components/widget/ChatLoadFailFallback";

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("accessToken")?.value;

  return (
    <ErrorBoundary
      FallbackComponent={ChatLoadFailFallback}
    >
      <Suspense>
        <TokenProvider token={token}>{children}</TokenProvider>
      </Suspense>
    </ErrorBoundary>
  );
}
