import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { ReactNode } from "react";

import { type MyPageInfo,ProfileCircle } from "@/features/my-page";
import { NotificationPanelOverlay } from "@/features/notification";

import {
  BoardIconFilled,
  HomeIconFilled,
  MyPageIcon,
  NotificationIcon,
  ThunderIconFilled,
} from "@/shared/components/Icons";
import { cn } from "@/shared/lib";

import { ChatMenuButton } from "../ChatMenuButton/ChatMenuButton";

type TabsContentProps = {
  isHomeActive: boolean;
  isLightningActive: boolean;
  isBoardActive: boolean;
  isMyPageActive: boolean;
  isProfileLoading: boolean;
  myPageInfo: MyPageInfo | undefined;
};

type TabLinkProps = {
  href: string;
  isActive: boolean;
  label: string;
  icon: ReactNode;
  prefetch?: boolean;
};

const sidebarTabLinkClassName =
  "flex h-12 w-full cursor-pointer flex-row items-center justify-center gap-3";
const sidebarTabIconWrapClassName =
  "flex size-9 shrink-0 items-center justify-center";

function bottomTabIconClassName(isActive: boolean) {
  return cn(
    "size-full",
    isActive
      ? "text-grey-800 fill-grey-800 stroke-grey-800"
      : "text-grey-400 fill-grey-400 stroke-grey-400"
  );
}

function sidebarTabLabelClassName(isActive: boolean) {
  return cn(
    "hidden w-20 text-left text-base font-semibold leading-none 2xl:block",
    isActive ? "text-grey-800" : "text-grey-400"
  );
}

function SidebarTabLink({
  href,
  isActive,
  label,
  icon,
  prefetch = false,
}: TabLinkProps) {
  return (
    <Link href={href} className={sidebarTabLinkClassName} prefetch={prefetch}>
      <span className={sidebarTabIconWrapClassName}>{icon}</span>
      <span className={sidebarTabLabelClassName(isActive)}>{label}</span>
    </Link>
  );
}

function ProfileTabIcon({
  isActive,
  isLoading,
  myPageInfo,
}: {
  isActive: boolean;
  isLoading: boolean;
  myPageInfo: MyPageInfo | undefined;
}) {
  if (isLoading || !myPageInfo) {
    return <MyPageIcon className={bottomTabIconClassName(isActive)} />;
  }

  return (
    <ProfileCircle
      myInfo={myPageInfo}
      className={cn(
        "size-9",
        isActive ? "border-grey-800" : "border-grey-400 opacity-60 grayscale"
      )}
    />
  );
}

export function Sidebar({
  isHomeActive,
  isLightningActive,
  isBoardActive,
  isMyPageActive,
  isProfileLoading,
  myPageInfo,
}: TabsContentProps) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const notificationOverlayRef = useRef<HTMLDivElement>(null);
  const [tabsWidth, setTabsWidth] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    const element = tabsRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setTabsWidth(entry.target.clientWidth);
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isNotificationOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        tabsRef.current &&
        !tabsRef.current.contains(event.target as Node) &&
        !notificationOverlayRef.current?.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isNotificationOpen]);

  return (
    <>
      <nav
        className="sticky top-0 z-30 hidden h-app w-auto flex-shrink-0 bg-background px-6 py-2 md:block"
        ref={tabsRef}
      >
        <ul className="flex w-full list-none flex-col items-center justify-start gap-6">
          <li>
            <Link href="/home" className="relative block h-12 w-full cursor-pointer">
              <Image
                src="/logos/pungdeong_logo.png"
                alt="logo"
                className="h-full w-full object-contain"
                fill
              />
            </Link>
          </li>

          <li>
            <SidebarTabLink
              href="/home"
              isActive={isHomeActive}
              label="홈"
              prefetch
              icon={<HomeIconFilled className={bottomTabIconClassName(isHomeActive)} />}
            />
          </li>

          <li>
            <SidebarTabLink
              href="/lightning"
              isActive={isLightningActive}
              label="번개"
              icon={
                <ThunderIconFilled className={bottomTabIconClassName(isLightningActive)} />
              }
            />
          </li>

          <li>
            <SidebarTabLink
              href="/board/main"
              isActive={isBoardActive}
              label="게시판"
              icon={<BoardIconFilled className={bottomTabIconClassName(isBoardActive)} />}
            />
          </li>

          <li>
            <ChatMenuButton
              linkClassName={sidebarTabLinkClassName}
              iconWrapClassName={sidebarTabIconWrapClassName}
              labelClassName={sidebarTabLabelClassName}
              iconClassName={bottomTabIconClassName}
            />
          </li>

          <li>
            <button
              type="button"
              className={sidebarTabLinkClassName}
              onClick={() => setIsNotificationOpen(true)}
            >
              <span className={sidebarTabIconWrapClassName}>
                <NotificationIcon
                  className={bottomTabIconClassName(isNotificationOpen)}
                />
              </span>
              <span className={sidebarTabLabelClassName(isNotificationOpen)}>
                알림
              </span>
            </button>
          </li>

          <li>
            <SidebarTabLink
              href="/my-page"
              isActive={isMyPageActive}
              label="프로필"
              prefetch
              icon={
                <ProfileTabIcon
                  isActive={isMyPageActive}
                  isLoading={isProfileLoading}
                  myPageInfo={myPageInfo}
                />
              }
            />
          </li>
        </ul>
      </nav>
      <NotificationPanelOverlay
        isOpen={isNotificationOpen}
        tabsWidth={tabsWidth}
        onClose={() => setIsNotificationOpen(false)}
        overlayRef={notificationOverlayRef}
      />
    </>
  );
}
