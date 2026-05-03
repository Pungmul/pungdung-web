import { sortChatRoomByDate } from "../lib";

import { removeChatRoomFromList } from "./remove-chat-room-from-list.service";
import { resetUnreadCountInRoomList } from "./reset-unread-count-in-room-list.service";
import { updateLastMessageInRoomList } from "./update-last-message-in-room-list.service";
import type { ChatRoomUpdateMessage } from "../socket/socket-message.schema";
import type { ChatRoomListItem } from "../types/chat-room.types";

export type MergeRoomListSocketNotificationResult =
  | { kind: "noop" }
  | { kind: "invalidate" }
  | { kind: "data"; rooms: ChatRoomListItem[] };

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
      rooms: resetUnreadCountInRoomList(oldList, message.chatRoomUUID),
    };
  }

  if (message.type === "EXIT") {
    return {
      kind: "data",
      rooms: removeChatRoomFromList(oldList, message.chatRoomUUID),
    };
  }

  if (!("timestamp" in message && "content" in message)) {
    return { kind: "noop" };
  }

  const { chatRoomUUID: roomId, content, timestamp } = message;
  const withUpdatedLastMessage = updateLastMessageInRoomList(
    oldList,
    roomId,
    content ?? "",
    timestamp
  );
  const newData = withUpdatedLastMessage.map((item) =>
    item.chatRoomUUID !== roomId
      ? item
      : {
          ...item,
          unreadCount:
            focusingRoomId === roomId
              ? 0
              : item.unreadCount
              ? item.unreadCount + 1
              : 1,
        }
  );

  return { kind: "data", rooms: sortChatRoomByDate(newData) };
}
