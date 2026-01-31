import BottomTabs from "@pThunder/shared/components/layout/BottomTabs";
import {
  NotificationToast,
  NotificationContainer,
  FCMClient,
} from "@/features/notification";
import "@/app/globals.css";
import { HeaderProgressBar, ToastContainer } from "@/shared/components";
import { Suspense } from "react";
import ReactQueryProviders from "@/shared/lib/useReactQuery";
import { SocketProvider } from "@/core";
import { ChatNotificationSocket } from "@/features/chat";
import { getInitialViewFromCookie } from "@pThunder/shared/lib/getInitialViewFromCookie";

// export const dynamic = "force-static";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialView = await getInitialViewFromCookie();

  return (
    <ReactQueryProviders>
      <SocketProvider>
        <div id="main-contents" className="relative flex">
          <FCMClient />
          <NotificationContainer />
          <ChatNotificationSocket />
          <NotificationToast />
          <ToastContainer />
          <Suspense fallback={null}>
            <HeaderProgressBar />
          </Suspense>
          <div className="flex-grow flex flex-col-reverse max-w-[100dvw] md:flex-row z-0 h-auto min-h-app">
            <BottomTabs initialView={initialView} />
            {children}
          </div>
        </div>
      </SocketProvider>
    </ReactQueryProviders>
  );
}
