"use client";

import { Header, Space } from "@/shared";

import { ChangePasswordForm } from "@/features/auth/components";
import { useChangePasswordForm } from "@/features/auth/hooks/form";

export default function ChangePasswordPage() {
  const changePasswordForm = useChangePasswordForm();

  return (
    <div className="bg-grey-100 h-full w-full">
      <main className="max-w-[640px] mx-auto w-full h-full flex flex-col items-center bg-background">
        <Header title="비밀번호 변경" />
        <Space h={36} />
        <div className="w-full px-[36px]">
          <div className="p-[16px] bg-grey-200 rounded-[10px]">
            <p className="text-sm font-normal text-grey-600">로그인에 사용할 비밀번호를 변경해요.</p>
            <p className="text-sm font-normal text-grey-600">현재 비밀번호와 새로운 비밀번호를 입력해주세요.</p>
          </div>
        </div>
        <Space h={24} />

        <div className="w-full max-w-[640px] mx-auto px-[32px] flex-grow">
          <ChangePasswordForm {...changePasswordForm} />
        </div>
      </main>
    </div>
  );
}
