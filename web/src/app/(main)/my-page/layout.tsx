import { cookies } from "next/headers";

import { hasAuthSessionCookie, LoginRequiredPage } from "@/features/auth";

export default async function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  if (
    !hasAuthSessionCookie(
      cookieStore.get("accessToken")?.value,
      cookieStore.get("refreshToken")?.value
    )
  ) {
    return <LoginRequiredPage returnPath="/my-page" />;
  }

  return children;
}
