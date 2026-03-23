"use client";

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { FireIcon, TicketIcon } from "@heroicons/react/24/solid";

import { WebViewLink } from "@/shared/components";
import { CommentOutline } from "@/shared/components/Icons";

import { BoardList } from "./BoardList";
import type { BoardSummary } from "../../types";
import { LastUpdateTime } from "../ui/LastUpdateTime";

/** `boardList`는 메인 목록에 쓰이도록 상위(페이지)에서 필터된 배열을 넘긴다. */
interface BoardMainPageContentProps {
  boardList: BoardSummary[];
  time: number;
}

const boardMainPageContentItemList = [
  {
    icon: (
      <PencilSquareIcon className="size-full text-grey-400" />
    ),
    title: "내가 쓴 글",
    href: "/board/my-post",
  },
  {
    icon: (
      <CommentOutline className="size-full text-grey-400" />
    ),
    title: "내가 쓴 댓글",
    href: "/board/my-comment",
  },
  {
    icon: (
      <TicketIcon className="size-full text-blue-200" />
    ),
    title: "관람 예정인 공연",
    href: "/board/promote/upcoming",
  },
  {
    icon: (
      <FireIcon className="size-full text-warning" />
    ),
    title: "HOT 게시판",
    href: "/board/hot-post",
  },
];

export function BoardMainPageContent({
  boardList,
  time
}: BoardMainPageContentProps) {
  return (
    <div className="flex flex-col h-full w-full ">
      <div className="w-full h-fit flex-grow px-6 py-2 bg-grey-100">
        <div className=" flex flex-col">
          <div className="text-[22px] font-semibold p-[4px]">게시판</div>
          <div className="px-[8px] pb-[8px]">
            <LastUpdateTime time={time} />
          </div>
          <div className="flex flex-col lg:flex-row gap-[16px]">
            <ul className="py-3 px-2 border-0.5 border-grey-200 bg-background rounded-md flex flex-col flex-grow gap-[8px] list-none h-fit">
              {boardMainPageContentItemList.map((item) => (
                <BoardMainPageContentItem key={item.title} {...item} />
              ))}
            </ul>
            <BoardList boardList={boardList} />
          </div>
        </div>
      </div>
    </div>
  );
}

const BoardMainPageContentItem = ({
  icon,
  title,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
}) => {
  return (
    <li>
      <WebViewLink
        href={href}
        prefetch
        className="w-full px-[12px] py-[8px] flex flex-row items-center gap-[12px] cursor-pointer"
      >
        <div className="flex size-7 items-center justify-center p-0.5">
          {icon}
        </div>
        <div className="text-[15px] leading-7 text-grey-600">
          {title}
        </div>
      </WebViewLink>
    </li>
  );
};
