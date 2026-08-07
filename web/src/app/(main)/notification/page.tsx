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
    <div className="flex flex-col h-full">
      <Header title="알림" />
      <NotificationList />
    </div>
  );
}
