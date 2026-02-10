"use client";

import { ResetPasswordForm } from "@/features/auth/components";
import { useResetPasswordForm } from "@/features/auth/hooks/form";

export function ResetPasswordClient({
  temporaryToken,
}: {
  temporaryToken: string;
}) {
  const resetPassword = useResetPasswordForm(temporaryToken);
  return <ResetPasswordForm {...resetPassword} />;
}
