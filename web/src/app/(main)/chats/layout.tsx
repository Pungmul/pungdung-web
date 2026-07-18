import { cookies } from "next/headers";

import { LoginRequiredPage } from "@/features/auth";

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await cookies()).get("accessToken")) {
    return <LoginRequiredPage returnPath="/chats/r/inbox" />;
  }

  return children;
}
