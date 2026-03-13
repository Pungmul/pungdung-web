import { Metadata } from "next";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { Suspense } from "@suspensive/react";

import { prefetchNotReadMessageList } from "@/features/home";
import { NotificationList } from "@/features/notification";

import { Header } from "@/shared";

export const metadata: Metadata = {
  title: "풍덩 | 알림",
  description: "알림",
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function NotificationPage() {
  const queryClient = prefetchNotReadMessageList();

  return (
    <div className="flex flex-col h-full">
      <Header title="알림" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense clientOnly>
          <NotificationList />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
