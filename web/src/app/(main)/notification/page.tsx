import { Metadata } from "next";
import { cookies } from "next/headers";

import { Suspense } from "@suspensive/react";

import { hasAuthSessionCookie, LoginRequiredPage } from "@/features/auth";
import { NotificationList } from "@/features/notification";

import { Header, Spinner } from "@/shared";

export const metadata: Metadata = {
  title: "풍덩 | 알림",
  description: "알림",
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function NotificationPage() {
  const cookieStore = await cookies();
  if (
    !hasAuthSessionCookie(
      cookieStore.get("accessToken")?.value,
      cookieStore.get("refreshToken")?.value
    )
  ) {
    return <LoginRequiredPage returnPath="/notification" />;
  }

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
