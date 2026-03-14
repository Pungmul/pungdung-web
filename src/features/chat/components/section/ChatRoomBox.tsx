import Image from "next/image";
import Link from "next/link";

import { PhotoIcon } from "@heroicons/react/24/outline";

import { SkeletonView } from "@/shared/components";
import { formatRelativeDate } from "@/shared/lib/parseDateString";

import type { ChatRoomListItem } from "../../types/domain/chat-room.types";

const ChatRoomBox = ({ room }: { room: ChatRoomListItem }) => {
  return (
    <Link
      className="flex flex-row items-center cursor-pointer bg-background hover:bg-grey-100 px-[28px] py-[12px] gap-[12px]"
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
      <div className="md:flex flex-col flex-grow gap-[4px] overflow-hidden">
        <div className="flex flex-row items-start justify-between gap-[4px] leading-[125%]">
          <div className="text-[13px] font-semibold truncate max-lines-1 pr-2">
            {room.roomName}
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

const ChatRoomBoxSkeleton: React.FC<{ length?: number }> = ({ length = 8 }) => {
  return (
    <div className="flex flex-col h-full md:w-[360px] lg:w-[400px] md:border-r md:border-grey-200 w-full">
      <div
        className="flex flex-row items-center justify-between flex-shrink-0"
        style={{ height: 50, paddingLeft: 24, paddingRight: 24 }}
      />
      {Array.from({ length }).map((_, index) => (
        <div
          key={"room-skeleton-" + index}
          className="flex flex-row items-center bg-background px-[28px] py-[12px] gap-[12px] w-full"
        >
          {/* 프로필 이미지 스켈레톤 */}
          <div className="flex-shrink-0 w-[64px] aspect-square lg:w-[48px] lg:h-[48px] lg:min-w-[48px] rounded-[4px] bg-grey-200">
            <SkeletonView className="w-full h-full rounded-[4px]" />
          </div>

          {/* 텍스트 영역 스켈레톤 */}
          <div className="flex flex-col flex-grow gap-[4px] overflow-hidden">
            {/* 상단: 방 이름과 시간 */}
            <div className="flex flex-row items-start justify-between gap-[4px]">
              <SkeletonView className="h-[16px] w-[120px] rounded-[2px]" />
            </div>

            {/* 하단: 마지막 메시지 */}
            <div className="flex flex-row items-start justify-between gap-[8px]">
              <SkeletonView className="h-[16px] w-[96%] rounded-[2px]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { ChatRoomBox, ChatRoomBoxSkeleton };
