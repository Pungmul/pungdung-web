import { mergeChatMessagesNewestFirst } from "../../lib/message/merge-chat-messages-newest-first";
import type { ChatRoom, Message } from "../../types";

export function applyChatRoomGapMessagesToChatRoom(
  prev: ChatRoom | undefined,
  gapMessages: readonly Message[]
): ChatRoom | undefined {
  if (!prev || gapMessages.length === 0) {
    return prev;
  }

  return {
    ...prev,
    messageList: {
      ...prev.messageList,
      list: mergeChatMessagesNewestFirst(prev.messageList.list, gapMessages),
    },
  };
}
