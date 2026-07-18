"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/shared";
import { KakaoLogo } from "@/shared/components/Icons";

export function LoginRequiredPage({ returnPath }: { returnPath: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const currentReturnPath = pathname
    ? `${pathname}${query ? `?${query}` : ""}`
    : returnPath;
  return (
    <main className="mx-auto flex min-h-app w-full flex-col items-center justify-center gap-6 px-6 text-center md:max-w-[768px]">
      <div className="space-y-2">
        <h1 className="text-h2">로그인 후 이용할 수 있어요</h1>
        <p className="text-m1 text-grey-500">카카오로 바로 시작해보세요.</p>
      </div>
      <Button
        className="flex h-12 w-full max-w-[320px] items-center gap-3 !bg-kakao px-6 text-black"
        onClick={() => {
          window.location.href = `/api/auth/kakao/login?redirectURL=${encodeURIComponent(currentReturnPath)}`;
        }}
      >
        <KakaoLogo className="size-5" />
        카카오로 시작하기
      </Button>
    </main>
  );
}
