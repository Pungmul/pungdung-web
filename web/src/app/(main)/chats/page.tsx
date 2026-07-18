import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LoginRequiredPage } from "@/features/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function ChatMainPage() {
  if (!(await cookies()).get("accessToken")) {
    return <LoginRequiredPage returnPath="/chats" />;
  }

  redirect("/chats/r/inbox");

}
