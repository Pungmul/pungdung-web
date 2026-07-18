import { cookies } from "next/headers";

import { hasAuthSessionCookie } from "@/features/auth";

import { PromotionListPage } from "./_PromotionListPage";

export default async function PromotePageNew() {
  const cookieStore = await cookies();
  const isGuest = !hasAuthSessionCookie(
    cookieStore.get("accessToken")?.value,
    cookieStore.get("refreshToken")?.value
  );

  return <PromotionListPage isGuest={isGuest} />;
}
