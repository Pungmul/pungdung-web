"use client";

import { type RefObject, useCallback, useRef, useState } from "react";

import { useSocketSubscription } from "@/core/socket/hooks/useSocketSubscribe";

import { mapStompTimelineEnvelopeToMessage } from "../../lib/mappers";
import {
  normalizeSocketImageMessage,
  normalizeSocketTextMessage,
} from "../../services/socket-chat-incoming.service";
import {
  type StompAlarmEnvelope,
  stompAlarmEnvelopeSchema,
  stompTimelineMessageEnvelopeSchema,
} from "../../socket/socket-message.schema";
import {
  isImageMessage,
  isTextMessage,
  type Message,
} from "../../types";

/**
 * STOMP 구독 + 방 단위 소켓 버퍼 state를 **훅 내부**에서 관리합니다.
 *
 * `replaceSocketBuffer` — 방 전환 시 빈 배열, hydrate 결과 등 **전체 스냅샷** 덮어쓰기.
 * 실시간 수신은 내부에서만 append 됩니다.
 *
 * `socketAppendForPendingRef` — append 직전에 마지막으로 추가된 정규화 메시지 1건을 한 번 넣습니다.
 * 호출 측에서 `useLayoutEffect` 등으로 읽고 비우면 됩니다(replace 시에는 비움).
 */
export function useChatRoomSocketMessages({
  roomId,
  readSign,
}: {
  roomId: string;
  readSign: () => void;
}): {
  socketMessages: Message[];
  replaceSocketBuffer: (messages: readonly Message[]) => void;
  socketAppendForPendingRef: RefObject<Message | null>;
} {
  const [socketMessages, setSocketMessages] = useState<Message[]>([]);
  const socketAppendForPendingRef = useRef<Message | null>(null);

  const replaceSocketBuffer = useCallback((messages: readonly Message[]) => {
    socketAppendForPendingRef.current = null;
    setSocketMessages([...messages]);
  }, []);

  const append = useCallback(
    (chatMessage: Message) => {
      socketAppendForPendingRef.current = chatMessage;
      setSocketMessages((prev) => [...prev, chatMessage]);
      readSign();
    },
    [readSign],
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
    [append],
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
    [onAlarm],
  );

  const handleMessagePayload = useCallback(
    (raw: unknown) => {
      const parsed = stompTimelineMessageEnvelopeSchema.safeParse(raw);
      if (!parsed.success) return;
      onSocketTypedMessage(mapStompTimelineEnvelopeToMessage(parsed.data));
    },
    [onSocketTypedMessage],
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
    socketAppendForPendingRef,
  };
}
