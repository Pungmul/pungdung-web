import { Suspense } from "@suspensive/react";

import { SocketProvider } from "@/core";

import { ChatNotificationSocket } from "@/features/chat";
import {
  FCMClient,
  NotificationContainer,
  NotificationToast,
} from "@/features/notification";

import {
  HeaderProgressBar,
  Tabs,
  PWAInstallPrompt,
  ToastHost,
} from "@/shared/components";
import ReactQueryProviders from "@/shared/lib/useReactQuery";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProviders>
      <SocketProvider>
        <PWAInstallPrompt />
        <div id="main-contents" className="relative flex">
          <FCMClient />
          {/* FCM push banner (notification-container) vs action feedback (toast-container) */}
          <NotificationContainer />
          <ChatNotificationSocket />
          <NotificationToast />
          <Suspense clientOnly fallback={null}>
            <HeaderProgressBar />
          </Suspense>
          <div
            id="main-shell"
            className="relative flex-grow flex flex-col-reverse max-w-[100dvw] md:flex-row z-0 h-auto min-h-app"
          >
            <Tabs />
            <ToastHost />
            {children}
          </div>
        </div>
      </SocketProvider>
    </ReactQueryProviders>
  );
}
