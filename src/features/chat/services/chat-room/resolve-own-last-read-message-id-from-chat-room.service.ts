import type { ChatRoom } from "../../types/chat-room.types";

/** userInfoList.username → userId → userInitReadList.lastReadMessageId */
export function resolveOwnLastReadMessageIdFromChatRoom(
  chatRoom: ChatRoom,
  username: string
): number | null {
  const userId = chatRoom.userInfoList.find(
    (user) => user.username === username
  )?.userId;

  if (userId === undefined) {
    return null;
  }

  return (
    chatRoom.userInitReadList.find((readState) => readState.userId === userId)
      ?.lastReadMessageId ?? null
  );
}
