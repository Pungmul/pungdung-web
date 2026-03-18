"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Suspense } from "@suspensive/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";

import { myPageQueries, ProfileCircle } from "@/features/my-page";
import { NotificationList, notificationQueries } from "@/features/notification";

import { Spinner } from "@/shared";
import {
  BoardIconFilled,
  BoardIconOutline,
  HomeIconFilled,
  HomeIconOutline,
  NotificationIcon,
  ThunderIconFilled,
  ThunderIconOutline,
} from "@/shared/components/Icons";
import { Header } from "@/shared/components/layout/Header";
import { useView } from "@/shared/lib/view/view-store-provider";

import ChatMenuButton from "./ChatMenuButton/ChatMenuButton";

export default function BottomTabs() {
  const view = useView();
  const queryClient = useQueryClient();

  const tabsRef = useRef<HTMLDivElement>(null);
  const notificationOverlayRef = useRef<HTMLDivElement>(null);

  const [tabsWidth, setTabsWidth] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { data: myPageInfo, isLoading } = useQuery(myPageQueries.info());

  useEffect(() => {
    if (isNotificationOpen) {
      queryClient.invalidateQueries({
        queryKey: notificationQueries.unreadList().queryKey,
      });
    }
  }, [isNotificationOpen, queryClient]);

  useEffect(() => {
    const element = tabsRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // border, padding을 포함한 전체 너비를 가져오기 위해 offsetWidth 사용
        setTabsWidth(entry.target.clientWidth);
      }
    });

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        tabsRef.current &&
        !notificationOverlayRef.current?.contains(event.target as Node) &&
        isNotificationOpen
      ) {
        setIsNotificationOpen(false);
      }
    };

    resizeObserver.observe(element);
    document.addEventListener("click", handleOutsideClick);

    return () => {
      resizeObserver.disconnect();
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isNotificationOpen]);

  useEffect(() => {
    const issueToken = async (tokens: {
      accessToken: string;
      refreshToken: string;
    }) => {
      try {
        const res = await fetch("/api/auth/cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tokens),
        });

        if (res.ok) {
          if (typeof window === "undefined" || !window?.ReactNativeWebView) {
            return;
          }
          window?.ReactNativeWebView.postMessage(
            JSON.stringify("Cookie issued")
          );
        } else throw Error("Failed to issue cookies");
      } catch {
        if (typeof window === "undefined" || !window?.ReactNativeWebView) {
          return;
        }
        window?.ReactNativeWebView.postMessage(
          JSON.stringify("Cookie didn't issue")
        );
      }
    };

    const handleMessage = (event: MessageEvent) => {
      const isReactNativeWebView = () => {
        if (typeof window !== "undefined") {
          return /React-Native/i.test(window.navigator.userAgent);
        }
        return false;
      };

      const isWebView = isReactNativeWebView();

      if (isWebView) {
        const { accessToken, refreshToken } = JSON.parse(event.data);
        if (!accessToken || !refreshToken) return;

        issueToken({ accessToken, refreshToken });
      }
    };

    document.addEventListener("message", handleMessage as EventListener);
    window.addEventListener("message", handleMessage);

    return () => {
      document.addEventListener("message", handleMessage as EventListener);
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const pathname = usePathname(); // 현재 경로 가져오기

  if (view === "webview") {
    return null;
  }

  if (
    view === "mobile" &&
    pathname !== "/home" &&
    pathname !== "/board/main" &&
    pathname !== "/chats/r/inbox" &&
    pathname !== "/lightning" &&
    pathname !== "/my-page"
  )
    return null;

  return (
    <>
      <nav
        className={`w-full py-[8px] bg-background flex-shrink-0 border-t sticky z-30 md:border-r md:border-t-0 md:w-auto md:h-app px-[32px] ${view === "desktop" ? " top-0" : " bottom-0"
          }`}
        ref={tabsRef}
      >
        <div>
          <ul className="list-none w-full flex flex-row md:flex-col md:gap-[24px] items-center justify-between md:justify-start">
            <li className="hidden md:block">
              <Link
                href={"/home"}
                className="relative h-12 w-full cursor-pointer hidden md:block"
              >
                <Image
                  src={"/logos/pungdeong_logo.png"}
                  alt="logo"
                  className="object-contain w-full h-full"
                  fill
                />
              </Link>
            </li>
            <li>
              {/* home page button */}
              <Link
                href={"/home"}
                className="h-12 justify-center items-center cursor-pointer flex gap-[24px] flex-row"
                prefetch
              >
                {pathname.startsWith("/home") ? (
                  <HomeIconFilled className="w-[36px] h-[36px] text-grey-800" />
                ) : (
                  <HomeIconOutline className="w-[36px] h-[36px] text-grey-800" />
                )}
                <span className="hidden 2xl:block w-[100px] text-[16px] self-end pb-[8px] font-semibold text-grey-800">
                  홈
                </span>
              </Link>
            </li>

            {/* newsfeed page button  */}
            {/* <div className="w-12 h-12 justify-center items-center cursor-pointer flex" onClick={() => router.push('/newsfeed')}>
                {pathname == '/newsfeed' ? <Image src={NewsFeedIconFilled} width={36} alt="" /> : <Image src={NewsFeedIconOutline} width={36} alt="" />}
            </div> */}

            <li>
              {" "}
              {/* lightning page button */}
              <Link
                href={"/lightning"}
                className="h-12 justify-center items-center cursor-pointer flex gap-[24px] flex-row"
              >
                {pathname.startsWith("/lightning") ? (
                  <ThunderIconFilled className="w-[36px] h-[36px] text-grey-800" />
                ) : (
                  <ThunderIconOutline className="w-[36px] h-[36px] text-grey-800" />
                )}
                <span className="hidden 2xl:block w-[100px] text-[16px] self-end pb-[8px] font-semibold text-grey-800">
                  번개
                </span>
              </Link>
            </li>

            {/* board page button */}
            <li>
              <Link
                href={"/board/main"}
                className="h-12 justify-center items-center cursor-pointer flex gap-[24px] flex-row"
              >
                {pathname.startsWith("/board") ? (
                  <BoardIconFilled className="w-[36px] h-[36px] text-grey-800" />
                ) : (
                  <BoardIconOutline className="w-[36px] h-[36px] text-grey-800" />
                )}
                <span className="hidden 2xl:block w-[100px] text-[16px] self-end pb-[8px] font-semibold text-grey-800">
                  게시판
                </span>
              </Link>
            </li>

            {/* chat page button */}
            <li>
              <ChatMenuButton />
            </li>
            <li className="hidden md:block">
              <button
                type="button"
                className="hidden md:flex h-12 justify-center items-center cursor-pointer gap-[24px] flex-row"
                onClick={() => setIsNotificationOpen(true)}
              >
                {/* notification button */}
                <NotificationIcon className="w-[36px] h-[36px] text-grey-800 cursor-pointer" />
                <span className="hidden 2xl:block text-left w-[100px] text-[16px] self-end pb-[8px] font-semibold text-grey-800">
                  알림
                </span>
              </button>
            </li>
            <li>
              <Link
                href={"/my-page"}
                className="h-12 justify-center items-center cursor-pointer flex gap-[24px] flex-row"
                prefetch
              >
                {isLoading || !myPageInfo ? (
                  <UserCircleIcon className="w-[36px] h-[36px] text-grey-800" />
                ) : (
                  <ProfileCircle myInfo={myPageInfo} />
                )}
                <span className="hidden 2xl:block w-[100px] text-[16px] self-end pb-[8px] font-semibold text-grey-800">
                  프로필
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <AnimatePresence mode="wait">
        {isNotificationOpen && (
          <motion.div
            key="notification-overlay"
            ref={notificationOverlayRef}
            initial={{ x: -360 + tabsWidth }}
            animate={{ x: tabsWidth }}
            exit={{ x: -360 + tabsWidth }}
            transition={{ duration: 0.5 }}
            className="md:flex hidden fixed left-0 top-0 bottom-0 w-[360px] h-app flex-shrink-0 flex-col bg-background border backdrop-blur-sm z-20"
          >
            <div className="flex flex-col h-full w-full min-h-0">
              <Header
                title="알림"
                isBackBtn={false}
                rightBtn={
                  <div
                    className="w-[36px] h-[36px] flex items-center justify-center cursor-pointer"
                    onClick={() => setIsNotificationOpen(false)}
                  >
                    <XMarkIcon className="w-[24px] h-[24px]" />
                  </div>
                }
              />
              <Suspense
                clientOnly
                fallback={
                  <div className="flex items-center justify-center h-full">
                    <Spinner size={32} />
                  </div>
                }
              >
                <NotificationList />
              </Suspense>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
