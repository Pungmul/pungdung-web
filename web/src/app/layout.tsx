import { Viewport } from "next";
import localFont from "next/font/local";

import { FCMServiceWorkerRegistration } from "@/features/notification";

import {
  AlertModal,
  PinchZoomPreventionScript,
  ThemePreferenceBootScript,
  ThemePreferenceInitializer,
  ViewDetector,
} from "@/shared/components";
import { getInitialViewFromCookie } from "@/shared/lib/getInitialViewFromCookie";
import { getThemePreferenceFromCookie } from "@/shared/lib/getThemePreferenceFromCookie";
import { ViewStoreProvider } from "@/shared/lib/view/view-store-provider";

import "@/app/globals.css";

const nanumSquareNeo = localFont({
  src: [
    {
      path: "../../public/fonts/NanumSquareNeo-Variable.woff2",
      weight: "100 900", // 가변 폰트 범위 설정
    },
  ],
  variable: "--font-nanum",
});

export const viewport: Viewport = {
  userScalable: false,
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
  viewportFit: "cover" /* PWA stand-alone 시 노치/홈 인디케이터 영역 대응 */,
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialView = await getInitialViewFromCookie();
  const initialThemePreference = await getThemePreferenceFromCookie();

  return (
    <html
      lang="ko"
      className={nanumSquareNeo.variable}
      data-theme={
        initialThemePreference === "system" ? undefined : initialThemePreference
      }
    >
      <head>
        {/* board/main 전용이 아니라 static/cached 라우트 전반의 초기 테마 깜빡임을 막기 위해 전역에 둔다. */}
        <ThemePreferenceBootScript />
      </head>
      <body>
        <ThemePreferenceInitializer />
        <PinchZoomPreventionScript />
        <FCMServiceWorkerRegistration />
        <AlertModal />
        <ViewStoreProvider initialView={initialView}>
          <ViewDetector />
          {/* children은 페이지 컴포넌트 */}
          {/* 페이지 컴포넌트가 서버 컴포넌트라도 오류 없이 렌더링 됨 */}
          {children}
        </ViewStoreProvider>
      </body>
    </html>
  );
}
