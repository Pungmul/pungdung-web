import { PhotoIcon } from "@heroicons/react/24/outline";

import {
  IMAGE_LAST_MESSAGE_PREVIEW,
  isImageLastMessagePreview,
} from "../../../../lib/message/image-last-message-preview";

type ChatRoomBoxPreviewProps = {
  lastMessageContent: string | null;
  unreadCount: number | null;
};

export function ChatRoomBoxPreview({
  lastMessageContent,
  unreadCount,
}: ChatRoomBoxPreviewProps) {
  const count = unreadCount ?? 0;

  return (
    <div className="flex-grow flex flex-row items-center justify-center">
      <div className="flex-grow text-ellipsis overflow-hidden text-grey-600 text-[13px] leading-[125%] whitespace-pre-line line-clamp-2">
        {isImageLastMessagePreview(lastMessageContent) ? (
          <span className="flex flex-row items-center gap-[4px]">
            <span className="size-6 p-1 flex items-center justify-center">
              <PhotoIcon className="size-full text-grey-600" />
            </span>
            {IMAGE_LAST_MESSAGE_PREVIEW}
          </span>
        ) : (
          lastMessageContent ?? "새로운 채팅방에 초대 되었습니다."
        )}
      </div>
      <div
        className={`flex size-[24px] shrink-0 rounded-full items-center justify-center bg-primary text-background ${count > 0 ? "" : "opacity-0"}`}
        aria-hidden={count <= 0}
      >
        <span className="pt-0.5 vertical-center text-center text-[11px] font-bold">
          {count > 99 ? "99+" : count}
        </span>
      </div>
    </div>
  );
}
