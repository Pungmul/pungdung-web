import type { ReadSocketMessage } from "../socket/socket-message.schema";
import type { ChatRoom } from "../types/domain/chat-room.types";

/**
 * 현재 방 스냅샷(`ChatRoom`)과 읽음 소켓 페이로드로 다음 상태를 계산합니다.
 * `lastReadMessageId`를 정할 수 없으면 `undefined`를 반환합니다(캐시는 그대로 둠).
 */
export function mergeChatRoomWithReadSocketMessage(
  prev: ChatRoom | undefined,
  readMessage: ReadSocketMessage
): ChatRoom | undefined {
  if (!prev) return undefined;

  const { userId, messageIds } = readMessage.content;

  let lastReadMessageId: number | null = null;

  if (messageIds.length > 0) {
    // 서버가 읽음 처리된 메시지 ID를 줄 때는 그 중 최대값을 사용
    lastReadMessageId = Math.max(...messageIds);
  } else if (prev.messageList?.list?.length) {
    // messageIds가 비어 있으면 현재 메시지 리스트의 최신 메시지 ID 사용
    const messageList = prev.messageList.list;
    const latestMessage = messageList[messageList.length - 1];
    if (latestMessage && typeof latestMessage.id === "number") {
      lastReadMessageId = latestMessage.id;
    }
  }

  if (lastReadMessageId === null) {
    return undefined;
  }

  return {
    ...prev,
    // ChatRoom 쿼리의 userInitReadList(상대 읽음 위치) 갱신
    userInitReadList: prev.userInitReadList.map((user) =>
      user.userId === userId ? { ...user, lastReadMessageId } : user
    ),
  };
}
