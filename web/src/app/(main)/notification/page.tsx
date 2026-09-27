import { Metadata } from "next";
import { cookies } from "next/headers";

import { hasAuthSessionCookie, LoginRequiredPage } from "@/features/auth";
import { NotificationList } from "@/features/notification";

import { Header } from "@/shared";

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
    <div className="flex h-full flex-col bg-grey-100">
      <Header title="알림" />
      <div className="min-h-0 flex-1">
        <NotificationList />
      </div>
    </div>
  );
}
