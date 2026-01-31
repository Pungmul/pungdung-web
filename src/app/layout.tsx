import { Viewport } from "next";
import localFont from "next/font/local";

import {
  PinchZoomPreventionScript,
  ViewDetector,
  AlertModal,
  PWAInstallPrompt,
} from "@/shared/components";
import { FCMServiceWorkerRegistration } from "@/features/notification";
import { getInitialViewFromCookie } from "@pThunder/shared/lib/getInitialViewFromCookie";

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

// export const dynamic = "force-static";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialView = await getInitialViewFromCookie();

  return (
    <html lang="ko" className={nanumSquareNeo.variable}>
      <body>
        <PinchZoomPreventionScript />
        <FCMServiceWorkerRegistration />
        <PWAInstallPrompt />
        <ViewDetector initialView={initialView} />
        <AlertModal />
        {/* children은 페이지 컴포넌트 */}
        {/* 페이지 컴포넌트가 서버 컴포넌트라도 오류 없이 렌더링 됨 */}
        {children}
      </body>
    </html>
  );
}
