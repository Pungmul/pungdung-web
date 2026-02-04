"use client";
import { ChatRoomBox, ChatRoomBoxSkeleton } from "./ChatRoomBox";
import { useSelectFriendModal } from "@/features/friends/store";
import { Suspense, useState } from "react";
import { getChoseong } from "es-hangul";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  ChatAddIcon,
  ChatIconOutline,
} from "@pThunder/shared/components/Icons";
import { Responsive, SearchInput } from "@/shared/components";
import { useChatRoomListQuery } from "../../queries";
import AddChatRoomButton from "../element/AddChatRoomButton";

export default function ChatRoomList() {
  const { data: chatRooms = [], isLoading } = useChatRoomListQuery();
  const { openModalToSelectFriend } = useSelectFriendModal();
  const clickAddChatButton = () => {
    openModalToSelectFriend();
  };

  const [isSearching, setIsSearching] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const filteredChatRooms = isSearching
    ? (chatRooms ?? []).filter((room) =>
      getChoseong(room.roomName).includes(getChoseong(searchKeyword))
    )
    : chatRooms ?? [];
  const isEmpty = !isLoading && filteredChatRooms.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] md:h-app md:w-[360px] lg:w-[400px] md:border-r md:border-grey-200 w-full">
      <div className="flex flex-row items-center justify-between flex-shrink-0 h-[56px] px-[24px]">
        <div className="flex-grow" style={{ fontSize: 16, fontWeight: 700 }}>
          채팅 목록
        </div>
        <div className="flex flex-row gap-1">
          {/* 돋보기로 수정 */}
          <MagnifyingGlassIcon
            className="size-[32px] cursor-pointer p-[4px]"
            onClick={() => setIsSearching(true)}
          />
          {/* 채팅 추가로 변경 */}
          <ChatAddIcon
            className="size-[32px] p-[4px] text-grey-800 cursor-pointer"
            onClick={clickAddChatButton}
          />
        </div>
      </div>
      {isSearching && (
        <div className="w-full p-2 bg-background">
          <SearchInput
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onClose={() => {
              setSearchKeyword("");
              setIsSearching(false);
            }}
          />
        </div>
      )}
      <div
        className="relative w-full h-full flex-grow flex flex-col overflow-y-auto"
        style={{ scrollbarWidth: "thin" }}
      >
        {isLoading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <ChatRoomBoxSkeleton key={"room-skeleton-" + index} />
          ))
        ) : isEmpty ? (
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
          filteredChatRooms.map((room, index) => (
            <ChatRoomBox
              key={room.chatRoomUUID || "room-" + index}
              room={room}
            />
          ))
        )}
      </div>
    </div>
  );
}
