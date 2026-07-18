import { cookies } from "next/headers";

import { hasAuthSessionCookie, LoginRequiredPage } from "@/features/auth";

import { LightningPageClient } from "./LightningPageClient";

export default async function LightningPage() {
  const cookieStore = await cookies();
  if (
    !hasAuthSessionCookie(
      cookieStore.get("accessToken")?.value,
      cookieStore.get("refreshToken")?.value
    )
  ) {
    return <LoginRequiredPage returnPath="/lightning" />;
  }

  return <LightningPageClient />;
}
