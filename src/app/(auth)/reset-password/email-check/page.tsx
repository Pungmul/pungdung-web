"use client";

import { useRouter } from "next/navigation";

import { Header } from "@/shared";

import { EmailCheckForm } from "@/features/auth/components";
import { useEmailCheckForm } from "@/features/auth/hooks/form";

export default function ResetPasswordEmailCheckPage() {
  const router = useRouter();
  const emailCheck = useEmailCheckForm({
    onSuccess: () => {
      router.push("/reset-password");
    },
  });

  return (
    <div className="w-full min-h-app h-full flex flex-col justify-center items-center">
      <div className="w-full max-w-[768px] mx-auto flex-1 flex flex-col">
        <Header title="비밀번호 재설정" />
        <EmailCheckForm {...emailCheck} />
      </div>
    </div>
  );
}
