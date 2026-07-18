import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { hasAuthSessionCookie, LoginRequiredPage } from "@/features/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function ChatMainPage() {
  const cookieStore = await cookies();
  if (
    !hasAuthSessionCookie(
      cookieStore.get("accessToken")?.value,
      cookieStore.get("refreshToken")?.value
    )
  ) {
    return <LoginRequiredPage returnPath="/chats" />;
  }

  redirect("/chats/r/inbox");

}
