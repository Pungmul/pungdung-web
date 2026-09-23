"use client";

import Image from "next/image";
import Link from "next/link";

import { formatRelativeDate } from "@/shared/lib/parseDateString";

import {
  chatRoomBoxMemberCount,
  chatRoomBoxTypeLabel,
} from "./chat-room-box-display";
import { ChatRoomBoxPreview } from "./ChatRoomBoxPreview";
import { ChatRoomBoxTitle } from "./ChatRoomBoxTitle";
import { usePrefetchChatRoomOnNavigate } from "../../../../hooks/actions";
import type { ChatRoomListItem } from "../../../../types";

const ChatRoomBox = ({ room }: { room: ChatRoomListItem }) => {
  const prefetchChatRoom = usePrefetchChatRoomOnNavigate();
  const memberCount = chatRoomBoxMemberCount(room);

  return (
    <Link
      className="flex w-full min-w-0 flex-row items-center cursor-pointer bg-background hover:bg-grey-100 px-[28px] py-[12px] gap-[12px]"
      href={`/chats/r/${room.chatRoomUUID}`}
      onPointerDown={() => prefetchChatRoom(room.chatRoomUUID)}
      onFocus={() => prefetchChatRoom(room.chatRoomUUID)}
    >
      <div className="relative flex-shrink-0 w-[64px] aspect-square lg:w-[48px] lg:h-[48px] lg:min-w-[48px] rounded-[4px] bg-grey-200 overflow-hidden">
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
          <ChatRoomBoxTitle
            roomName={room.roomName}
            typeLabel={chatRoomBoxTypeLabel(room.type)}
            memberCount={memberCount}
            isMuted={room.isMuted}
          />
          <div className="text-[11px] text-grey-500 flex-shrink-0">
            {room.lastMessageTime ? (
              formatRelativeDate(new Date(room.lastMessageTime))
            ) : (
              <div className="text-primary">신규</div>
            )}
          </div>
        </div>
        <ChatRoomBoxPreview
          lastMessageContent={room.lastMessageContent}
          unreadCount={room.unreadCount}
        />
      </div>
    </Link>
  );
};

export { ChatRoomBox };
