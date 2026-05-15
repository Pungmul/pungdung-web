"use client";

import { useCallback, useLayoutEffect, useRef } from "react";

import { logReadSignDebug } from "../../../lib/read-receipt/read-sign-debug-log";
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

      const upToMessageId = toNumericMessageId(socketMessage.id);

      if (!entryReadSignGate?.canPublishReadSign(roomId)) {
        logReadSignDebug("socket_message.readSign.blocked", {
          roomId,
          messageId: socketMessage.id,
          upToMessageId,
          senderUsername: socketMessage.senderUsername,
        });
        return;
      }

      entryReadSignGate.markReadSignHandled();
      logReadSignDebug("socket_message.readSign", {
        roomId,
        messageId: socketMessage.id,
        upToMessageId,
        senderUsername: socketMessage.senderUsername,
      });
      readSignRef.current({
        upToMessageId,
        source: "socket-message-appended",
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
