"use client";

import { useEffect } from "react";

import { registerFCMToken } from "../api";
import { getFCMTokenWhenGranted } from "../services";
import { supportsPushNotification } from "../lib/guards";

/**
 * 브라우저 알림 권한이 이미 granted인 경우(예: 이전에 허용한 사용자) 앱 로드 시
 * FCM 토큰을 발급받아 서버에 등록합니다. CTA의 버튼 플로우와 별개로 동작합니다.
 */
export function useRegisterFCMTokenIfGranted() {
  useEffect(() => {
    if (!supportsPushNotification()) return;

    let cancelled = false;

    (async () => {
      const token = await getFCMTokenWhenGranted();
      if (cancelled || !token) return;

      await registerFCMToken(token, navigator.userAgent);
    })();

    return () => {
      cancelled = true;
    };
  }, []);
}
