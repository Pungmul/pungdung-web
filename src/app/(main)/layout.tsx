import { Suspense } from "@suspensive/react";

import { AuthenticatedSocketProvider } from "./_AuthenticatedSocketProvider";

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
        <AuthenticatedSocketProvider>
          <div
            id="main-shell"
            className="relative flex-grow flex flex-col-reverse max-w-[100dvw] md:flex-row z-0 h-auto min-h-app"
          >
            <Tabs />
            <ToastHost />
            {children}
          </div>
        </AuthenticatedSocketProvider>
      </div>
    </ReactQueryProviders>
  );
}
