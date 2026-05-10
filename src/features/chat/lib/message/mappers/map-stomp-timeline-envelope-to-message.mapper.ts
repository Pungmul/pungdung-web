import type { StompTimelineMessageEnvelope } from "../../../socket/socket-message.schema";
import type { Message } from "../../../types/chat-message.types";

export function mapStompTimelineEnvelopeToMessage(
  envelope: StompTimelineMessageEnvelope,
): Message {
  const inner = envelope.content;

  switch (inner.chatType) {
    case "ENTER":
      return {
        id: inner.id,
        clientId: inner.clientId ?? null,
        senderUsername: inner.senderUsername,
        content: inner.content,
        chatType: "JOIN",
        imageUrlList: null,
        chatRoomUUID: inner.chatRoomUUID,
        createdAt: inner.createdAt,
      };
    case "LEAVE":
      return {
        id: inner.id,
        clientId: inner.clientId ?? null,
        senderUsername: inner.senderUsername,
        content: null,
        chatType: "LEAVE",
        imageUrlList: null,
        chatRoomUUID: inner.chatRoomUUID,
        createdAt: inner.createdAt,
      };
    case "CHAT": {
      if (envelope.domainType === "IMAGE") {
        const imageUrlList =
          inner.imageUrl !== null && inner.imageUrl !== "" ? [inner.imageUrl] : [];
        return {
          id: inner.id,
          clientId: inner.clientId ?? null,
          senderUsername: inner.senderUsername,
          content: null,
          chatType: "IMAGE",
          imageUrlList,
          chatRoomUUID: inner.chatRoomUUID,
          createdAt: inner.createdAt,
        };
      }
      return {
        id: inner.id,
        clientId: inner.clientId ?? null,
        senderUsername: inner.senderUsername,
        content: inner.content,
        chatType: "TEXT",
        imageUrlList: null,
        chatRoomUUID: inner.chatRoomUUID,
        createdAt: inner.createdAt,
      };
    }
    default: {
      const x: never = inner.chatType;
      throw new Error(`Unhandled stomp inner chatType: ${String(x)}`);
    }
  }
}
