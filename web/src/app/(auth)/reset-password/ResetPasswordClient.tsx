"use client";

import { useSearchParams } from "next/navigation";

import { ResetPasswordForm } from "@/features/auth/components";
import { useResetPasswordForm } from "@/features/auth/hooks/form";

export function ResetPasswordClient() {
  const temporaryToken = useSearchParams().get("token") ?? "";
  const resetPassword = useResetPasswordForm(temporaryToken);
  return <ResetPasswordForm {...resetPassword} />;
}
