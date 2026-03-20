"use client";

import { useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";

import { getChoseong } from "es-hangul";

import { SearchInput } from "@/shared/components";

import ChatRoomPanelHeader from "./ChatRoomPanelHeader";
import ChatRoomPanelList from "./ChatRoomPanelList";
import { CHAT_ROOM_PANEL_CLASS_NAME } from "./ChatRoomPanelSkeleton";
import { chatQueries } from "../../../queries";
import { useSelectFriendModal } from "../../../store/select-friend-modal.context";

export default function ChatRoomPanelContent() {
  const { data: chatRooms } = useSuspenseQuery(chatQueries.roomList());
  const { openModalToSelectFriend } = useSelectFriendModal();

  const [isSearching, setIsSearching] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredChatRooms = isSearching
    ? chatRooms.filter((room) =>
      getChoseong(room.roomName).includes(getChoseong(searchKeyword))
    )
    : chatRooms;

  return (
    <div className={CHAT_ROOM_PANEL_CLASS_NAME}>
      <ChatRoomPanelHeader
        totalCount={chatRooms.length}
        onStartSearch={() => setIsSearching(true)}
        onClickAddChat={openModalToSelectFriend}
      />
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
      <ChatRoomPanelList rooms={filteredChatRooms} />
    </div>
  );
}
