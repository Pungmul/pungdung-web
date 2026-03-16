import type {
  StompTimelineDirectDomainMessage,
  StompTimelineMessageEnvelope,
  StompTimelineSocketPayload,
} from "../../socket/socket-message.schema";
import type { Message } from "../../types/domain/chat-message.types";

/**
 * STOMP 타임라인 envelope(`stompTimelineMessageEnvelopeSchema` 파싱 결과) → 타임라인 도메인 `Message`.
 *
 * - envelope `domainType`은 텍스트/이미지 스레드 구분(CHAT/IMAGE), REST `chatType`(TEXT/IMAGE/…)과 다른 축이다.
 * - inner `ENTER` / `LEAVE`는 도메인 `JOIN` / `LEAVE`로 맞춘다.
 */
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
          inner.imageUrl !== null && inner.imageUrl !== ""
            ? [inner.imageUrl]
            : [];
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
