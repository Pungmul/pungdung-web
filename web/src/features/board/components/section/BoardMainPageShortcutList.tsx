"use client";

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { FireIcon, TicketIcon } from "@heroicons/react/24/solid";

import { cn } from "@/shared";
import { WebViewLink } from "@/shared/components";
import { CommentOutline } from "@/shared/components/Icons";

import { BoardGuestLoginPrompt } from "./BoardGuestLoginPrompt";

interface BoardMainPageShortcutListProps {
  isGuest: boolean;
}

const boardMainPageContentItemList = [
  {
    icon: <PencilSquareIcon className="size-full text-grey-400" />,
    title: "내가 쓴 글",
    href: "/board/my-post",
  },
  {
    icon: <CommentOutline className="size-full text-grey-400" />,
    title: "내가 쓴 댓글",
    href: "/board/my-comment",
  },
  {
    icon: <TicketIcon className="size-full text-blue-200" />,
    title: "관람 예정인 공연",
    href: "/board/promote/upcoming",
  },
  {
    icon: <FireIcon className="size-full text-warning" />,
    title: "HOT 게시판",
    href: "/board/hot-post",
  },
];

export function BoardMainPageShortcutList({
  isGuest,
}: BoardMainPageShortcutListProps) {
  return (
    <ul className="relative py-3 px-2 border-0.5 border-grey-200 bg-background rounded-md flex flex-col flex-grow gap-[8px] list-none h-fit overflow-hidden">
      {boardMainPageContentItemList.map((item) => (
        <BoardMainPageShortcutListItem
          key={item.title}
          {...item}
          isGuest={isGuest}
        />
      ))}
      {isGuest && (
        <li className="absolute inset-0 z-10 [background:color-mix(in_srgb,var(--background)_70%,transparent)] backdrop-blur-sm">
          <BoardGuestLoginPrompt message="로그인 후 자유롭게 볼 수 있어요!" messageClassNames="text-grey-700" />
        </li>
      )}
    </ul>
  );
}

function BoardMainPageShortcutListItem({
  icon,
  title,
  href,
  isGuest,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
  isGuest: boolean;
}) {
  return (
    <li
      inert={isGuest}
      className={cn(isGuest && "pointer-events-none blur-[2px] opacity-50")}
    >
      <WebViewLink
        href={href}
        prefetch
        className="w-full px-[12px] py-[8px] flex flex-row items-center gap-[12px] cursor-pointer"
      >
        <div className="flex size-7 items-center justify-center p-0.5">
          {icon}
        </div>
        <div className="text-[15px] leading-7 text-grey-600">{title}</div>
      </WebViewLink>
    </li>
  );
}
