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
  PWAInstallPrompt,
  ToastContainer,
} from "@/shared/components";
import BottomTabs from "@/shared/components/layout/BottomTabs";
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
          <NotificationContainer />
          <ChatNotificationSocket />
          <NotificationToast />
          <ToastContainer />
          <Suspense clientOnly fallback={null}>
            <HeaderProgressBar />
          </Suspense>
          <div className="flex-grow flex flex-col-reverse max-w-[100dvw] md:flex-row z-0 h-auto min-h-dvh">
            <BottomTabs />
            {children}
          </div>
        </div>
      </SocketProvider>
    </ReactQueryProviders>
  );
}
