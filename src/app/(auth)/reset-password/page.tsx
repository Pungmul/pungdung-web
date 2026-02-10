import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResetPasswordClient } from "./ResetPasswordClient";

export const metadata: Metadata = {
  title: "비밀번호 재설정 | 풍덩",
  description: "풍덩의 비밀번호 재설정 페이지 입니다.",
};

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token: temporaryToken } = await searchParams;
  if (!temporaryToken) {
    return notFound();
  }
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full max-w-[640px] mx-auto px-[24px]">
        <ResetPasswordClient temporaryToken={temporaryToken} />
      </div>
    </div>
  );
}
