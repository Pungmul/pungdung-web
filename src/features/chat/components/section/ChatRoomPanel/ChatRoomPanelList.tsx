import { Suspense } from "@suspensive/react";

import { Responsive } from "@/shared/components";
import { ChatIconOutline } from "@/shared/components/Icons";

import type { ChatRoomListItem } from "../../../types/domain/chat-room.types";
import AddChatRoomButton from "../../ui/AddChatRoomButton";
import { ChatRoomBox } from "../ChatRoomBox";

type ChatRoomPanelListProps = {
  rooms: ChatRoomListItem[];
};

export default function ChatRoomPanelList({
  rooms,
}: ChatRoomPanelListProps) {
  const isEmpty = rooms.length === 0;

  return (
    <div
      className="relative w-full h-full flex-grow flex flex-col overflow-y-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      {isEmpty ? (
        <Responsive
          mobile={
            <div className="flex flex-col flex-grow h-full w-full justify-center items-center px-6">
              <div className="flex flex-col items-center gap-[24px] text-center">
                <ChatIconOutline className="w-[64px] h-[64px]" />
                <div className="text-[15px] text-grey-600">
                  친구와 대화를 시작해보세요
                </div>
                <Suspense fallback={<div>로딩 중...</div>}>
                  <AddChatRoomButton />
                </Suspense>
              </div>
            </div>
          }
          desktop={
            <div className="flex flex-col flex-grow h-full w-full justify-center items-center px-6">
              <div className="flex flex-col items-center gap-[24px] text-center">
                <div className="text-[15px] text-grey-600">
                  친구와 대화를 시작해보세요
                </div>
              </div>
            </div>
          }
        />
      ) : (
        rooms.map((room, index) => (
          <ChatRoomBox
            key={room.chatRoomUUID || "room-" + index}
            room={room}
          />
        ))
      )}
    </div>
  );
}
