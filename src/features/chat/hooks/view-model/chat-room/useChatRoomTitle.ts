"use client";

import { useEffect, useState } from "react";

import type { ChatRoom } from "../../../types/chat-room.types";

interface UseChatRoomTitleParams {
  chatRoomData: ChatRoom | undefined;
  roomNameOverride?: string;
  defaultTitle?: string;
}

interface UseChatRoomTitleReturn {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * 채팅방 제목을 관리하고 document.title을 업데이트하는 훅
 *
 * @param params - 훅 설정 파라미터
 * @returns title 상태와 setter
 *
 * @example
 * const { title, setTitle } = useChatRoomTitle({
 *   chatRoomData,
 *   defaultTitle: "채팅"
 * });
 */
export const useChatRoomTitle = ({
  chatRoomData,
  roomNameOverride,
  defaultTitle = "채팅",
}: UseChatRoomTitleParams): UseChatRoomTitleReturn => {
  const [title, setTitle] = useState("");

  // 채팅방 데이터가 로드되면 title 설정
  useEffect(() => {
    if (chatRoomData) {
      setTitle(roomNameOverride ?? chatRoomData.chatRoomInfo.roomName);
    }
  }, [chatRoomData, roomNameOverride]);

  // document.title 업데이트
  useEffect(() => {
    if (title) {
      document.title = `풍덩 | ${title}`;
    } else {
      document.title = `풍덩 | ${defaultTitle}`;
    }
  }, [title, defaultTitle]);

  return {
    title,
    setTitle,
  };
};
