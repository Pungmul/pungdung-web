"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { FireIcon, TicketIcon } from "@heroicons/react/24/solid";

import { CommentOutline } from "@/shared/components/Icons";

import { BoardList } from "./BoardList";
import type { BoardSummary } from "../../types";
import { LastUpdateTime } from "../ui/LastUpdateTime";

/** `boardList`는 메인 목록에 쓰이도록 상위(페이지)에서 필터된 배열을 넘긴다. */
interface BoardMainPageContentProps {
  boardList: BoardSummary[];
}

const boardMainPageContentItemList = [
  {
    icon: <PencilSquareIcon className="size-[24px] text-grey-400" />,
    title: "내가 쓴 글",
    href: "/board/my-post",
  },
  {
    icon: <CommentOutline className="size-[24px] text-grey-400" />,
    title: "내가 쓴 댓글",
    href: "/board/my-comment",
  },
  {
    icon: <TicketIcon className="size-[24px] text-blue-200" />,
    title: "관람 예정인 공연",
    href: "/board/promote/upcoming",
  },
  {
    icon: <FireIcon className="size-[24px] text-warning" />,
    title: "HOT 게시판",
    href: "/board/hot-post",
  },
];

export function BoardMainPageContent({
  boardList,
}: BoardMainPageContentProps) {
  return (
    <div className="flex flex-col h-full w-full ">
      <div className="w-full h-fit flex-grow px-6 py-2 bg-grey-100">
        <div className=" flex flex-col">
          <div className="text-[22px] font-semibold p-[4px]">게시판</div>
          <div className="px-[8px] pb-[8px]">
            <LastUpdateTime />
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
  const router = useRouter();

  return (
    <li>
      <Link
        href={href}
        prefetch={false}
        className="w-full px-[12px] py-[8px] flex flex-row items-end gap-[12px] cursor-pointer"
        onMouseEnter={() => {
          void router.prefetch(href);
        }}
        onTouchStart={() => {
          void router.prefetch(href);
        }}
      >
        <div className="flex justify-center items-center size-[28px]">
          {icon}
        </div>
        <div className="text-[15px] text-grey-600">
          {title}
        </div>
      </Link>
    </li>
  );
};
