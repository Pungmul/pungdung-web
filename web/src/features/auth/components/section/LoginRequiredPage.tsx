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
  const loginUrl = `/login?next=${encodeURIComponent(currentReturnPath)}`;

  return (
    <main className="flex min-h-app w-full flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-2">
        <h1 className="text-h2">로그인 후 이용할 수 있어요</h1>
        <p className="text-m1 text-grey-500">카카오로 바로 시작해보세요.</p>
      </div>
      <Button
        className="flex items-center gap-3 !bg-kakao px-6 text-black"
        onClick={() => {
          window.location.href = `/api/auth/kakao/login?redirectURL=${encodeURIComponent(currentReturnPath)}`;
        }}
      >
        <KakaoLogo className="size-5" />
        카카오로 시작하기
      </Button>
      <a className="text-m1 text-grey-500 underline" href={loginUrl}>
        다른 방법으로 로그인
      </a>
    </main>
  );
}
