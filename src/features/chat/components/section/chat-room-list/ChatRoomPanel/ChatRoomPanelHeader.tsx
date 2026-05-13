import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { ChatAddIcon } from "@/shared/components/Icons";

type ChatRoomPanelHeaderProps = {
  totalCount: number;
  onStartSearch: () => void;
  onClickAddChat: () => void;
};

export default function ChatRoomPanelHeader({
  totalCount,
  onStartSearch,
  onClickAddChat,
}: ChatRoomPanelHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-background flex flex-row items-center justify-between flex-shrink-0 h-[56px] px-[24px]">
      <div className="flex-grow" style={{ fontSize: 16, fontWeight: 700 }}>
        채팅 목록
        <span className="text-grey-500 text-[13px] ml-4">
          {totalCount}
        </span>
      </div>
      <div className="flex flex-row gap-1">
        <span
          className="size-8 p-1 flex items-center justify-center cursor-pointer"
          onClick={onStartSearch}
        >
          <MagnifyingGlassIcon className="size-full" />
        </span>
        <span
          className="size-8 p-1 flex items-center justify-center cursor-pointer"
          onClick={onClickAddChat}
        >
          <ChatAddIcon className="size-full text-grey-800" />
        </span>
      </div>
    </div>
  );
}
