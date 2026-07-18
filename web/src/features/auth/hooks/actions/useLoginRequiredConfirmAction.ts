"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { alertStore } from "@/shared/store";

export function useLoginRequiredConfirmAction() {
  const Alert = alertStore();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = useMemo(() => {
    const query = searchParams.toString();

    return `${pathname ?? "/home"}${query ? `?${query}` : ""}`;
  }, [pathname, searchParams]);

  const requestLogin = useCallback(() => {
    Alert.confirm({
      title: "로그인 필요",
      message: "로그인 후 이용할 수 있습니다. 로그인하시겠어요?",
      confirmText: "로그인하기",
      onConfirm: () => {
        router.push(`/login?next=${encodeURIComponent(returnPath)}`);
      },
    });
  }, [Alert, returnPath, router]);

  return { requestLogin };
}
