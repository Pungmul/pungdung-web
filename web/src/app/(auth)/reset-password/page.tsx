import { Suspense } from "react";
import { Metadata } from "next";

import { ResetPasswordClient } from "./ResetPasswordClient";

export const metadata: Metadata = {
  title: "비밀번호 재설정 | 풍덩",
  description: "풍덩의 비밀번호 재설정 페이지 입니다.",
};

export default function ResetPassword() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full max-w-[640px] mx-auto px-[24px]">
        <Suspense>
          <ResetPasswordClient />
        </Suspense>
      </div>
    </div>
  );
}
