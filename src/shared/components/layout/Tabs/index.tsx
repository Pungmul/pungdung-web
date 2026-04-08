"use client";
import { usePathname } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { myPageQueries } from "@/features/my-page";
import { Responsive } from "@/shared/components/Responsive";
import { useView } from "@/shared/lib/view/view-store-provider";

import { BottomTabs } from "./BottomTabs";
import { Sidebar } from "./Sidebar";
import { useWebViewCookieBridge } from "../../../hooks/";

const MOBILE_TAB_EXACT_PATHS = [
  "/home",
  "/board/main",
  "/chats/r/inbox",
  "/lightning",
  "/my-page",
];

function isMobileTabExactPath(pathname: string) {
  return MOBILE_TAB_EXACT_PATHS.includes(pathname);
}

export default function Tabs() {
  const view = useView();
  const pathname = usePathname();
  const { data: myPageInfo, isLoading } = useQuery(myPageQueries.info());

  useWebViewCookieBridge();

  if (view === "webview") {
    return null;
  }

  if (view !== "desktop" && !isMobileTabExactPath(pathname)) {
    return null;
  }

  const tabState = {
    isHomeActive: pathname.startsWith("/home"),
    isLightningActive: pathname.startsWith("/lightning"),
    isBoardActive: pathname.startsWith("/board"),
    isMyPageActive: pathname.startsWith("/my-page"),
    isProfileLoading: isLoading,
    myPageInfo,
  };

  return (
    <Responsive
      mobile={<BottomTabs {...tabState} />}
      desktop={<Sidebar {...tabState} />}
    />
  );
}
