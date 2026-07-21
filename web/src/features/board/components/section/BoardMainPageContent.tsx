import { BoardList } from "./BoardList";
import { BoardMainPageShortcutList } from "./BoardMainPageShortcutList";
import type { BoardSummary } from "../../types";
import { LastUpdateTime } from "../ui/LastUpdateTime";

/** `boardList`는 메인 목록에 쓰이도록 상위(페이지)에서 필터된 배열을 넘긴다. */
interface BoardMainPageContentProps {
  boardList: BoardSummary[];
  time: number;
  isGuest: boolean;
}

export function BoardMainPageContent({
  boardList,
  time,
  isGuest,
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
            <BoardMainPageShortcutList isGuest={isGuest} />
            <BoardList boardList={boardList} isGuest={isGuest} />
          </div>
        </div>
      </div>
    </div>
  );
}
