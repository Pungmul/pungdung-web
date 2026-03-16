import type { PendingMessage } from "./pending-message.types";

/** 전송 API 밖에서 pending queue만 조작하는 room-local handler 계약입니다. */
export type ChatRoomOutgoingMessageHandlers = {
  beginTextSend: (content: string) => string;
  commitTextSendSuccess: (pendingId: string) => void;
  commitTextSendFailure: (pendingId: string) => void;
  beginImageSend: (files: FileList) => string;
  commitImageSendSuccess: (pendingId: string) => void;
  commitImageSendFailure: (pendingId: string) => void;
  beginRetryTextSend: (failed: PendingMessage) => string | null;
  beginRetryImageSend: (
    failed: PendingMessage,
    files: FileList
  ) => string | null;
};
