import { cookies } from "next/headers";

import { LoginRequiredPage } from "@/features/auth";

import { LightningPageClient } from "./LightningPageClient";

export default async function LightningPage() {
  if (!(await cookies()).get("accessToken")) {
    return <LoginRequiredPage returnPath="/lightning" />;
  }

  return <LightningPageClient />;
}
