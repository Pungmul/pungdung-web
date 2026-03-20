import { SkeletonView } from "@/shared/components";

const CHAT_ROOM_PANEL_CLASS_NAME =
  "flex flex-col h-[calc(100vh-65px)] md:h-app w-full md:w-[360px] md:min-w-[360px] md:shrink-0 lg:w-[400px] lg:min-w-[400px] md:border-r md:border-grey-200";

const CHAT_ROOM_PANEL_SKELETON_COUNT = 8;

const ChatRoomPanelSkeletonRow = () => (
  <div className="flex w-full min-w-0 flex-row items-center bg-background px-[28px] py-[12px] gap-[12px]">
    <div className="relative flex-shrink-0 w-[64px] aspect-square lg:w-[48px] lg:h-[48px] lg:min-w-[48px] rounded-[4px] bg-grey-200 overflow-hidden">
      <SkeletonView className="w-full h-full rounded-[4px]" />
    </div>
    <div className="flex min-w-0 flex-col flex-grow gap-[4px] overflow-hidden">
      <div className="flex flex-row items-start justify-between gap-[4px] leading-[125%]">
        <SkeletonView className="h-[16px] w-[120px] rounded-[2px]" />
        <SkeletonView className="h-[14px] w-[40px] rounded-[2px] flex-shrink-0" />
      </div>
      <div className="flex-grow flex flex-row items-start justify-center">
        <SkeletonView className="h-[16px] flex-1 min-w-0 rounded-[2px]" />
      </div>
    </div>
  </div>
);

export function ChatRoomPanelSkeleton() {
  return (
    <div className={CHAT_ROOM_PANEL_CLASS_NAME}>
      <div className="flex flex-row items-center justify-between flex-shrink-0 h-[56px] px-[24px]">
        <div className="flex-grow" style={{ fontSize: 16, fontWeight: 700 }}>
          채팅 목록
        </div>
      </div>
      {Array.from({ length: CHAT_ROOM_PANEL_SKELETON_COUNT }).map((_, index) => (
        <ChatRoomPanelSkeletonRow key={`chat-panel-skeleton-${index}`} />
      ))}
    </div>
  );
}

export { CHAT_ROOM_PANEL_CLASS_NAME };
