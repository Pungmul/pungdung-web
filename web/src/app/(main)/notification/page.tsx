import { Metadata } from "next";

import { Suspense } from "@suspensive/react";

import { NotificationList } from "@/features/notification";

import { Header, Spinner } from "@/shared";

export const metadata: Metadata = {
  title: "풍덩 | 알림",
  description: "알림",
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function NotificationPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="알림" />
      <Suspense
        clientOnly
        fallback={
          <div className="flex items-center justify-center h-full">
            <Spinner size={32} />
          </div>
        }>
        <NotificationList />
      </Suspense>
    </div>
  );
}
