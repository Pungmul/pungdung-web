"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Suspense } from "@suspensive/react";

import { ChatTabBadge } from "@/features/chat";

import { ChatIconFilled, ChatIconOutline } from "@/shared/components/Icons";

export default function ChatMenuButton() {
  const pathname = usePathname();

  return (
    <Link
      href={"/chats/r/inbox"}
      className="h-12 justify-center items-center cursor-pointer flex gap-[24px] flex-row"
      prefetch
    >
      <Suspense
        clientOnly
        fallback={
          pathname.startsWith("/chats") ? (
            <ChatIconFilled className="w-[36px] h-[36px] text-grey-800" />
          ) : (
            <ChatIconOutline className="w-[36px] h-[36px] text-grey-800" />
          )
        }
      >
        <ChatTabBadge>
          {pathname.startsWith("/chats") ? (
            <ChatIconFilled className="w-[36px] h-[36px] text-grey-800" />
          ) : (
            <ChatIconOutline className="w-[36px] h-[36px] text-grey-800" />
          )}
        </ChatTabBadge>
      </Suspense>
      <div className="hidden 2xl:block w-[100px] text-[16px] self-end pb-[8px] font-semibold text-grey-800">
        채팅
      </div>
    </Link>
  );
}
