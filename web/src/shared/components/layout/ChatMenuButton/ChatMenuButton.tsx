"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Suspense } from "@suspensive/react";

import { ChatTabBadge } from "@/features/chat";

import { ChatIconFilled } from "@/shared/components/Icons";

type ChatMenuButtonProps = {
  linkClassName: string;
  iconWrapClassName: string;
  labelClassName: (isActive: boolean) => string;
  iconClassName: (isActive: boolean) => string;
};

function ChatMenuIcon({
  isActive,
  iconWrapClassName,
  iconClassName,
}: {
  isActive: boolean;
  iconWrapClassName: string;
  iconClassName: (isActive: boolean) => string;
}) {
  return (
    <ChatTabBadge>
      <span className={iconWrapClassName}>
        <ChatIconFilled className={iconClassName(isActive)} />
      </span>
    </ChatTabBadge>
  );
}

function ChatMenuIconFallback({
  isActive,
  iconWrapClassName,
  iconClassName,
}: {
  isActive: boolean;
  iconWrapClassName: string;
  iconClassName: (isActive: boolean) => string;
}) {
  return (
    <span className={iconWrapClassName}>
      <ChatIconFilled className={iconClassName(isActive)} />
    </span>
  );
}

export function ChatMenuButton({
  linkClassName,
  iconWrapClassName,
  labelClassName,
  iconClassName,
}: ChatMenuButtonProps) {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/chats");

  return (
    <Link href="/chats/r/inbox" className={linkClassName} prefetch>
      <Suspense
        clientOnly
        fallback={
          <ChatMenuIconFallback
            isActive={isActive}
            iconWrapClassName={iconWrapClassName}
            iconClassName={iconClassName}
          />
        }
      >
        <ChatMenuIcon
          isActive={isActive}
          iconWrapClassName={iconWrapClassName}
          iconClassName={iconClassName}
        />
      </Suspense>
      <span className={labelClassName(isActive)}>채팅</span>
    </Link>
  );
}
