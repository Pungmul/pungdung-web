import { cookies } from "next/headers";

import { LoginRequiredPage } from "@/features/auth";

export default async function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await cookies()).get("accessToken")) {
    return <LoginRequiredPage returnPath="/my-page" />;
  }

  return children;
}
