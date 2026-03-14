import { sortChatRoomByDate } from "../lib";

import type { ChatRoomUpdateMessage } from "../socket/socket-message.schema";
import type { ChatRoomListItem } from "../types/domain/chat-room.types";

/**
 * 채팅방 리스트에서 특정 방의 안 읽은 메시지 수를 0으로 리셋합니다.
 *
 * @param rooms - 채팅방 리스트
 * @param roomId - 리셋할 채팅방의 UUID
 * @returns unreadCount가 리셋된 새 배열
 *
 * @example
 * const updatedRooms = resetUnreadCount(rooms, "room-123");
 */
export const resetUnreadCount = (
  rooms: ChatRoomListItem[],
  roomId: string
): ChatRoomListItem[] => {
  return rooms.map((room) =>
    room.chatRoomUUID === roomId ? { ...room, unreadCount: 0 } : room
  );
};

/**
 * 채팅방 리스트에서 특정 방을 제거합니다.
 *
 * @param rooms - 채팅방 리스트
 * @param roomId - 제거할 채팅방의 UUID
 * @returns 해당 방이 제거된 새 배열
 *
 * @example
 * const updatedRooms = removeChatRoom(rooms, "room-123");
 */
export const removeChatRoom = (
  rooms: ChatRoomListItem[],
  roomId: string
): ChatRoomListItem[] => {
  return rooms.filter((room) => room.chatRoomUUID !== roomId);
};

/**
 * 채팅방 리스트에서 특정 방의 마지막 메시지 정보를 업데이트합니다.
 *
 * @param rooms - 채팅방 리스트
 * @param roomId - 업데이트할 채팅방의 UUID
 * @param lastMessageContent - 마지막 메시지 내용
 * @param lastMessageTime - 마지막 메시지 시간
 * @returns 업데이트된 새 배열
 */
export const updateLastMessage = (
  rooms: ChatRoomListItem[],
  roomId: string,
  lastMessageContent: string,
  lastMessageTime: string
): ChatRoomListItem[] => {
  return rooms.map((room) =>
    room.chatRoomUUID === roomId
      ? { ...room, lastMessageContent, lastMessageTime }
      : room
  );
};

/**
 * 채팅방 리스트에서 특정 방의 안 읽은 메시지 수를 증가시킵니다.
 *
 * @param rooms - 채팅방 리스트
 * @param roomId - 증가시킬 채팅방의 UUID
 * @param increment - 증가시킬 수 (기본값: 1)
 * @returns unreadCount가 증가된 새 배열
 */
export const incrementUnreadCount = (
  rooms: ChatRoomListItem[],
  roomId: string,
  increment: number = 1
): ChatRoomListItem[] => {
  return rooms.map((room) =>
    room.chatRoomUUID === roomId
      ? { ...room, unreadCount: (room.unreadCount ?? 0) + increment }
      : room
  );
};

export type MergeRoomListSocketNotificationResult =
  | { kind: "noop" }
  | { kind: "invalidate" }
  | { kind: "data"; rooms: ChatRoomListItem[] };

/**
 * 알림 소켓 메시지에 맞춰 방 목록 캐시 스냅샷을 계산합니다.
 * `queryClient`에 반영은 호출부에서 합니다.
 */
export function mergeRoomListSocketNotification(
  oldList: ChatRoomListItem[] | undefined,
  message: ChatRoomUpdateMessage,
  focusingRoomId: string | undefined
): MergeRoomListSocketNotificationResult {
  if (!oldList) return { kind: "noop" };

  const room = oldList.find((r) => r.chatRoomUUID === message.chatRoomUUID);
  if (!room) return { kind: "invalidate" };

  if (message.type === "READ") {
    return {
      kind: "data",
      rooms: resetUnreadCount(oldList, message.chatRoomUUID),
    };
  }

  if (!("timestamp" in message && "content" in message)) {
    return { kind: "noop" };
  }

  const { chatRoomUUID: roomId, content, timestamp } = message;

  const newData = oldList.map((item) =>
    item.chatRoomUUID === roomId
      ? {
          ...item,
          lastMessageContent: content,
          lastMessageTime: timestamp,
          unreadCount:
            focusingRoomId === roomId
              ? 0
              : item.unreadCount
              ? item.unreadCount + 1
              : 1,
        }
      : item
  );

  return { kind: "data", rooms: sortChatRoomByDate(newData) };
}
