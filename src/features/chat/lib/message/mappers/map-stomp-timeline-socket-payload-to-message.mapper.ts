import { mapStompTimelineEnvelopeToMessage } from "./map-stomp-timeline-envelope-to-message.mapper";
import type {
  StompTimelineDirectDomainMessage,
  StompTimelineSocketPayload,
} from "../../../socket/socket-message.schema";
import type { Message } from "../../../types/chat-message.types";

export function mapStompTimelineSocketPayloadToMessage(
  payload: StompTimelineSocketPayload,
): Message {
  if ("messageLogId" in payload) {
    return mapStompTimelineEnvelopeToMessage(payload);
  }
  const direct = payload as StompTimelineDirectDomainMessage;
  switch (direct.chatType) {
    case "TEXT":
      return {
        id: direct.id,
        clientId: direct.clientId ?? null,
        senderUsername: direct.senderUsername,
        content: direct.content ?? "",
        chatType: "TEXT",
        imageUrlList: null,
        chatRoomUUID: direct.chatRoomUUID,
        createdAt: direct.createdAt,
      };
    case "IMAGE":
      return {
        id: direct.id,
        clientId: direct.clientId ?? null,
        senderUsername: direct.senderUsername,
        content: null,
        chatType: "IMAGE",
        imageUrlList: direct.imageUrlList ?? [],
        chatRoomUUID: direct.chatRoomUUID,
        createdAt: direct.createdAt,
      };
    case "JOIN":
      return {
        id: direct.id,
        clientId: direct.clientId ?? null,
        senderUsername: direct.senderUsername,
        content: direct.content ?? "",
        chatType: "JOIN",
        imageUrlList: null,
        chatRoomUUID: direct.chatRoomUUID,
        createdAt: direct.createdAt,
      };
    case "LEAVE":
      return {
        id: direct.id,
        clientId: direct.clientId ?? null,
        senderUsername: direct.senderUsername,
        content: null,
        chatType: "LEAVE",
        imageUrlList: null,
        chatRoomUUID: direct.chatRoomUUID,
        createdAt: direct.createdAt,
      };
  }
}
