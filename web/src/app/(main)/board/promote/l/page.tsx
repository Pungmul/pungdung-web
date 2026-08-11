import { cookies } from "next/headers";

import { hasAuthSessionCookie } from "@/features/auth";

import PromotionListBoundary from "./_PromotionListBoundary";
import { PromotionListPage } from "./_PromotionListPage";

export default async function PromotionListRoutePage() {
  const cookieStore = await cookies();
  const isGuest = !hasAuthSessionCookie(
    cookieStore.get("accessToken")?.value,
    cookieStore.get("refreshToken")?.value
  );

  return (
    <section className="relative flex w-full flex-col bg-background">
      <PromotionListBoundary>
        <PromotionListPage isGuest={isGuest} />
      </PromotionListBoundary>
    </section>
  );
}
