import Image from "next/image";
import Link from "next/link";

import { PhotoIcon } from "@heroicons/react/24/outline";
import { BellSlashIcon } from "@heroicons/react/24/solid";

import { formatRelativeDate } from "@/shared/lib/parseDateString";

import type { ChatRoomListItem } from "../../types/domain/chat-room.types";

const ChatRoomBox = ({ room }: { room: ChatRoomListItem }) => {
  return (
    <Link
      className="flex w-full min-w-0 flex-row items-center cursor-pointer bg-background hover:bg-grey-100 px-[28px] py-[12px] gap-[12px]"
      href={`/chats/r/${room.chatRoomUUID}`}
    >
      <div
        className="relative flex-shrink-0 w-[64px] aspect-square lg:w-[48px] lg:h-[48px] lg:min-w-[48px] rounded-[4px] bg-grey-200 overflow-hidden"
      >
        {/* 여기 이미지 삽입 */}
        {room.profileImageUrl && (
          <Image
            src={room.profileImageUrl}
            alt={`${room.roomName}의 프로필 이미지`}
            fill
            objectFit="cover"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-col flex-grow gap-[4px] overflow-hidden">
        <div className="flex flex-row items-start justify-between gap-[4px] leading-[125%]">
          <div className="flex items-center gap-1 min-w-0 pr-2">
            <div className="text-[13px] font-semibold truncate max-lines-1">
              {room.roomName}
            </div>
            <span className="inline-flex w-[14px] h-[14px] flex-shrink-0 items-center justify-center">
              <BellSlashIcon
                className={`size-[14px] text-grey-500 ${room.isMuted ? "visible" : "invisible"}`}
                aria-label={room.isMuted ? "알림 음소거됨" : undefined}
                aria-hidden={!room.isMuted}
              />
            </span>
          </div>
          <div className="text-[11px] text-grey-500 flex-shrink-0">
            {room.lastMessageTime ? (
              formatRelativeDate(new Date(room.lastMessageTime))
            ) : (
              <div className="text-primary">신규</div>
            )}
          </div>
        </div>
        <div className="flex-grow flex flex-row items-start justify-center">
          <div className="flex-grow text-ellipsis overflow-hidden text-grey-600 text-[13px] leading-[125%] whitespace-pre-line line-clamp-2">
            {room.lastMessageContent?.includes("이미지") ? (
              <span className="flex flex-row items-center gap-[4px]">
                <PhotoIcon className="size-[16px] text-grey-600" />
                {"이미지를 보냈습니다."}
              </span>
            ) : (
              room.lastMessageContent ?? "새로운 채팅방에 초대 되었습니다."
            )}
          </div>
          {(room?.unreadCount ?? 0) > 0 && (
            <div className="flex rounded-full items-center justify-center bg-primary text-background text-xs leading-[100%] size-6">
              {room.unreadCount! > 99 ? "99+" : room.unreadCount!}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
export { ChatRoomBox };
