import Link from "next/link";

import type { ReactNode } from "react";

import { type MyPageInfo,ProfileCircle } from "@/features/my-page";

import {
  BoardIconFilled,
  HomeIconFilled,
  MyPageIcon,
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

const bottomTabLinkClassName =
  "flex h-10 w-8 flex-col items-center justify-center gap-0.5 cursor-pointer";

const bottomTabIconWrapClassName =
  "flex size-6 shrink-0 items-center justify-center";

function bottomTabIconClassName(isActive: boolean) {
  return cn(
    "size-full",
    isActive
      ? "text-grey-800 fill-grey-800 stroke-grey-800"
      : "text-grey-400 fill-grey-400 stroke-grey-400"
  );
}

function bottomTabMobileLabelClassName(isActive: boolean) {
  return cn(
    "text-center text-[9px] font-normal leading-normal",
    isActive ? "text-grey-800" : "text-grey-400"
  );
}

function BottomTabLink({
  href,
  isActive,
  label,
  icon,
  prefetch = false,
}: TabLinkProps) {
  return (
    <Link href={href} className={bottomTabLinkClassName} prefetch={prefetch}>
      <span className={bottomTabIconWrapClassName}>{icon}</span>
      <span className={bottomTabMobileLabelClassName(isActive)}>{label}</span>
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
        "size-6",
        isActive ? "border-grey-800" : "border-grey-400 opacity-60 grayscale"
      )}
    />
  );
}

export function BottomTabs({
  isHomeActive,
  isLightningActive,
  isBoardActive,
  isMyPageActive,
  isProfileLoading,
  myPageInfo,
}: TabsContentProps) {
  return (
    <nav className="sticky bottom-0 z-30 w-full flex-shrink-0 bg-background px-7 py-2 md:hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-full h-2 max-md:block md:hidden bg-[linear-gradient(to_top,color-mix(in_srgb,var(--color-grey-800)_10%,transparent)_0%,color-mix(in_srgb,var(--color-grey-800)_6%,transparent)_45%,transparent_100%)]"
      />
      <ul className="list-none flex w-full flex-row items-center justify-between">
        <li>
          <BottomTabLink
            href="/home"
            isActive={isHomeActive}
            label="홈"
            prefetch
            icon={<HomeIconFilled className={bottomTabIconClassName(isHomeActive)} />}
          />
        </li>

        <li>
          <BottomTabLink
            href="/lightning"
            isActive={isLightningActive}
            label="번개"
            icon={
              <ThunderIconFilled className={bottomTabIconClassName(isLightningActive)} />
            }
          />
        </li>

        <li>
          <BottomTabLink
            href="/board/main"
            isActive={isBoardActive}
            label="게시판"
            icon={<BoardIconFilled className={bottomTabIconClassName(isBoardActive)} />}
          />
        </li>

        <li>
          <ChatMenuButton
            linkClassName={bottomTabLinkClassName}
            iconWrapClassName={bottomTabIconWrapClassName}
            labelClassName={bottomTabMobileLabelClassName}
            iconClassName={bottomTabIconClassName}
          />
        </li>

        <li>
          <Link href="/my-page" className={bottomTabLinkClassName} prefetch>
            <span className={bottomTabIconWrapClassName}>
              <ProfileTabIcon
                isActive={isMyPageActive}
                isLoading={isProfileLoading}
                myPageInfo={myPageInfo}
              />
            </span>
            <span className={bottomTabMobileLabelClassName(isMyPageActive)}>
              내 정보
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
