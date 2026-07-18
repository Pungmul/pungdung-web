import { cookies } from "next/headers";

import { hasAuthSessionCookie, LoginRequiredPage } from "@/features/auth";

export default async function LightningBuildAccessGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const hasSession = hasAuthSessionCookie(
    cookieStore.get("accessToken")?.value,
    cookieStore.get("refreshToken")?.value
  );

  if (!hasSession) {
    return <LoginRequiredPage returnPath="/lightning/build" />;
  }

  return children;
}
