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
    <div className="flex flex-row items-center justify-between flex-shrink-0 h-[56px] px-[24px]">
      <div className="flex-grow" style={{ fontSize: 16, fontWeight: 700 }}>
        채팅 목록
        <span className="text-grey-500 text-[13px] ml-4">
          {totalCount}
        </span>
      </div>
      <div className="flex flex-row gap-1">
        <MagnifyingGlassIcon
          className="size-[32px] cursor-pointer p-[4px]"
          onClick={onStartSearch}
        />
        <ChatAddIcon
          className="size-[32px] p-[4px] text-grey-800 cursor-pointer"
          onClick={onClickAddChat}
        />
      </div>
    </div>
  );
}
