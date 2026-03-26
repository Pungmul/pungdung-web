"use client";

import { useEffect, useState } from "react";

import type {
  ChatRoom,
  ChatRoomListItem,
} from "../../types/domain/chat-room.types";

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

/**
 * 채팅방 데이터에서 제목을 생성합니다.
 * 그룹 채팅인 경우 방 이름 뒤에 멤버 수를 표시합니다.
 *
 * @param chatRoomData - 채팅방 데이터
 * @returns 채팅방 제목 문자열
 *
 * @example
 * const title = getChatRoomTitle(chatRoomData);
 * // "개발팀 (5)" or "홍길동"
 */
export const getChatRoomTitle = (chatRoomData: ChatRoom): string => {
  return chatRoomData.chatRoomInfo.group
    ? `${chatRoomData.chatRoomInfo.roomName} (${chatRoomData.userInfoList.length})`
    : chatRoomData.chatRoomInfo.roomName;
};

/**
 * 채팅 목록 캐시 아이템에서 헤더 제목 문자열을 만듭니다.
 * {@link getChatRoomTitle}와 동일한 규칙(그룹일 때 이름 뒤 인원)을 따릅니다.
 */
export const getChatRoomTitleFromListItem = (
  item: ChatRoomListItem
): string => {
  return item.group
    ? `${item.roomName} (${item.chatRoomMemberIds.length})`
    : item.roomName;
};
