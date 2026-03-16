"use client";

import { useCallback, useState } from "react";

import { useSocketSubscription } from "@/core/socket/hooks/useSocketSubscribe";

import { isImageMessage, isTextMessage, type Message } from "../types";

import {
  type StompAlarmEnvelope,
  stompAlarmEnvelopeSchema,
  stompTimelineSocketPayloadSchema,
} from "./socket-message.schema";
import { mapStompTimelineSocketPayloadToMessage } from "../lib/mappers";
import {
  normalizeSocketImageMessage,
  normalizeSocketTextMessage,
} from "../services/socket-chat-incoming.service";

/**
 * STOMP 구독 + 방 단위 소켓 버퍼 state를 **훅 내부**에서 관리합니다.
 *
 * `replaceSocketBuffer` — 방 전환 시 빈 배열, hydrate 결과 등 **전체 스냅샷** 덮어쓰기.
 * 실시간 수신은 내부에서만 append 됩니다.
 *
 * `onSocketMessageAppended` — append와 **같은 동기 스택**에서 호출됩니다.
 * pending 제거 등을 여기서 하면 `setSocketMessages`와 배치되어 한 커밋에 반영됩니다.
 */
export function useChatRoomSocket({
  roomId,
  onSocketMessageAppended,
}: {
  roomId: string;
  onSocketMessageAppended?: (message: Message) => void;
}): {
  socketMessages: Message[];
  replaceSocketBuffer: (messages: readonly Message[]) => void;
} {
  const [socketMessages, setSocketMessages] = useState<Message[]>([]);

  const replaceSocketBuffer = useCallback((messages: readonly Message[]) => {
    setSocketMessages([...messages]);
  }, []);

  const append = useCallback(
    (chatMessage: Message) => {
      onSocketMessageAppended?.(chatMessage);
      setSocketMessages((prev) => [...prev, chatMessage]);
    },
    [onSocketMessageAppended]
  );

  const onSocketTypedMessage = useCallback(
    (message: Message) => {
      if (isTextMessage(message)) {
        append(normalizeSocketTextMessage(message));
        return;
      }
      if (isImageMessage(message)) {
        append(normalizeSocketImageMessage(message));
        return;
      }
      append(message);
    },
    [append]
  );

  const onAlarm = useCallback((payload: StompAlarmEnvelope) => {
    console.log(payload, "alarm message");
  }, []);

  const handleAlarmPayload = useCallback(
    (raw: unknown) => {
      const parsed = stompAlarmEnvelopeSchema.safeParse(raw);
      if (!parsed.success) return;
      onAlarm(parsed.data);
    },
    [onAlarm]
  );

  const handleMessagePayload = useCallback(
    (raw: unknown) => {
      const parsed = stompTimelineSocketPayloadSchema.safeParse(raw);
      if (!parsed.success) return;
      onSocketTypedMessage(mapStompTimelineSocketPayloadToMessage(parsed.data));
    },
    [onSocketTypedMessage]
  );

  useSocketSubscription({
    topic: `/sub/chat/alarm/${roomId}`,
    onMessage: handleAlarmPayload,
    enabled: !!roomId,
  });
  useSocketSubscription({
    topic: `/sub/chat/message/${roomId}`,
    onMessage: handleMessagePayload,
    enabled: !!roomId,
  });

  return {
    socketMessages,
    replaceSocketBuffer,
  };
}
