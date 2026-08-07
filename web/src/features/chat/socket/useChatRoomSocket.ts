"use client";

import { useCallback, useState } from "react";

import { useSocketSubscription } from "@pungdung/worker-socket-bridge/react";

import { ClientMapperError } from "@/core/api/client/client-mapper-error";
import {
  createSocketContractError,
  reportAppError,
} from "@/core/config/report-app-error";

import { normalizeSocketImageMessage } from "../services";
import { normalizeSocketTextMessage } from "../services";
import { isImageMessage, isTextMessage, type Message } from "../types";

import {
  stompAlarmEnvelopeSchema,
  stompTimelineSocketPayloadSchema,
} from "./socket-message.schema";
import { mapStompTimelineSocketPayloadToMessage } from "../lib/mappers";

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

  const handleAlarmPayload = useCallback((raw: unknown) => {
    stompAlarmEnvelopeSchema.safeParse(raw);
  }, []);

  const handleMessagePayload = useCallback(
    (raw: unknown) => {
      const parsed = stompTimelineSocketPayloadSchema.safeParse(raw);
      if (!parsed.success) {
        reportAppError(createSocketContractError(parsed.error.issues), {
          boundary: "api",
          feature: "chat",
          endpoint: `/sub/chat/message/${roomId}`,
        });
        return;
      }

      try {
        onSocketTypedMessage(
          mapStompTimelineSocketPayloadToMessage(parsed.data)
        );
      } catch (error) {
        const mapperError =
          error instanceof ClientMapperError
            ? error
            : new ClientMapperError({
                message: "소켓 응답을 앱 모델로 변환하는 데 실패했습니다.",
                context: `/sub/chat/message/${roomId}`,
                cause: error,
              });
        reportAppError(mapperError, {
          boundary: "api",
          feature: "chat",
          endpoint: `/sub/chat/message/${roomId}`,
        });
        throw mapperError;
      }
    },
    [onSocketTypedMessage, roomId]
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
