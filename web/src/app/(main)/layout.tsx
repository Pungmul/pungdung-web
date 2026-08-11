import { cookies } from "next/headers";

import { Suspense } from "@suspensive/react";

import { hasValidAccessToken } from "@/features/auth";
import { ChatNotificationSocket } from "@/features/chat";
import {
  FCMClient,
  NotificationContainer,
  NotificationToast,
} from "@/features/notification";

import {
  HeaderProgressBar,
  OfflineNotice,
  PWAInstallPrompt,
  Tabs,
  ToastHost,
} from "@/shared/components";
import ReactQueryProviders from "@/shared/lib/useReactQuery";

import { AuthenticatedSocketProvider } from "./_AuthenticatedSocketProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const hasAccessToken = hasValidAccessToken(
    cookieStore.get("accessToken")?.value,
  );

  const shell = (
    <div id="main-contents" className="relative flex">
      {hasAccessToken && (
        <>
          <FCMClient />
          <NotificationContainer />
          <ChatNotificationSocket />
          <NotificationToast />
        </>
      )}
      <Suspense clientOnly fallback={null}>
        <HeaderProgressBar />
      </Suspense>
      <Suspense clientOnly fallback={null}>
        <OfflineNotice />
      </Suspense>
      <div
        id="main-shell"
        className="relative flex-grow flex flex-col-reverse max-w-[100dvw] md:flex-row z-0 h-auto min-h-app"
      >
        <Tabs isAuthenticated={hasAccessToken} />
        {children}
        <ToastHost />
      </div>
    </div>
  );

  return (
    <ReactQueryProviders>
      <PWAInstallPrompt />
      {hasAccessToken ? (
        <AuthenticatedSocketProvider>{shell}</AuthenticatedSocketProvider>
      ) : (
        shell
      )}
    </ReactQueryProviders>
  );
}
