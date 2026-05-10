"use client";

import { useCallback, useLayoutEffect, useRef } from "react";

import { toNumericMessageId } from "../../../lib/message/parse-message-id";
import type { ReadSignFn } from "../../../socket/read-sign.types";
import { useChatRoomSocket } from "../../../socket/useChatRoomSocket";
import type { Message } from "../../../types";
import type { EntryReadSignGate } from "../../state/read-receipt/entry-read-sign-coord";

export type UseChatRoomSocketMessagesParams = {
  roomId: string;
  readSign: ReadSignFn;
  entryReadSignGate?: EntryReadSignGate;
  onSocketEchoMessage: (message: Message) => void;
};

export function useChatRoomSocketMessages({
  roomId,
  readSign,
  entryReadSignGate,
  onSocketEchoMessage,
}: UseChatRoomSocketMessagesParams) {
  const readSignRef = useRef(readSign);
  readSignRef.current = readSign;
  const onSocketEchoMessageRef = useRef(onSocketEchoMessage);
  onSocketEchoMessageRef.current = onSocketEchoMessage;

  const onSocketMessageAppended = useCallback(
    (socketMessage: Message) => {
      onSocketEchoMessageRef.current(socketMessage);

      if (!entryReadSignGate?.canPublishReadSign(roomId)) {
        return;
      }

      entryReadSignGate.markReadSignHandled();
      readSignRef.current({
        upToMessageId: toNumericMessageId(socketMessage.id),
      });
    },
    [entryReadSignGate, roomId]
  );

  const { socketMessages, replaceSocketBuffer } = useChatRoomSocket({
    roomId,
    onSocketMessageAppended,
  });

  useLayoutEffect(() => {
    replaceSocketBuffer([]);
  }, [replaceSocketBuffer, roomId]);

  return { socketMessages };
}
