import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

import { PendingMessage } from "../types";

interface CreatePendingTextMessageParams {
  senderUsername: string;
  content: string;
  chatRoomUUID: string;
}

interface CreatePendingImageMessageParams {
  senderUsername: string;
  files: FileList;
  chatRoomUUID: string;
}

/**
 * 텍스트 메시지 전송을 위한 pending 메시지 객체를 생성합니다.
 *
 * @param params - 메시지 생성에 필요한 파라미터
 * @returns pending 상태의 텍스트 메시지 객체
 *
 * @example
 * const pendingMsg = createPendingTextMessage({
 *   senderUsername: "user1",
 *   content: "안녕하세요",
 *   chatRoomUUID: "room-123"
 * });
 */
export const createPendingTextMessage = ({
  senderUsername,
  content,
  chatRoomUUID,
}: CreatePendingTextMessageParams): PendingMessage => {
  const clientId = uuidv4();
  return {
    id: clientId,
    clientId,
    senderUsername,
    content,
    chatType: "TEXT",
    imageUrlList: null,
    chatRoomUUID,
    createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    state: "pending",
  };
};

/**
 * 이미지 메시지 전송을 위한 pending 메시지 객체를 생성합니다.
 * 파일들을 ObjectURL로 변환하여 미리보기를 제공합니다.
 *
 * @param params - 메시지 생성에 필요한 파라미터
 * @returns pending 상태의 이미지 메시지 객체
 *
 * @example
 * const pendingMsg = createPendingImageMessage({
 *   senderUsername: "user1",
 *   files: fileList,
 *   chatRoomUUID: "room-123"
 * });
 */
export const createPendingImageMessage = ({
  senderUsername,
  files,
  chatRoomUUID,
}: CreatePendingImageMessageParams): PendingMessage => {
  const clientId = uuidv4();
  return {
    id: clientId,
    clientId,
    senderUsername,
    content: null,
    chatType: "IMAGE",
    imageUrlList: Array.from(files).map((file) => URL.createObjectURL(file)),
    chatRoomUUID,
    createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    state: "pending",
  };
};

/**
 * pending 메시지의 상태를 failed로 변경합니다.
 *
 * @param message - 상태를 변경할 메시지
 * @returns failed 상태로 변경된 메시지
 */
export const markMessageAsFailed = (
  message: PendingMessage,
): PendingMessage => {
  return {
    ...message,
    state: "failed",
  };
};

/**
 * pending 메시지 배열에서 특정 메시지를 failed 상태로 변경합니다.
 *
 * @param messages - pending 메시지 배열
 * @param messageId - 변경할 메시지의 id
 * @returns 상태가 변경된 새 배열
 */
export const updateMessageToFailed = (
  messages: PendingMessage[],
  messageId: string | number,
): PendingMessage[] => {
  return messages.map((msg) =>
    msg.id === messageId ? markMessageAsFailed(msg) : msg,
  );
};

/**
 * pending 메시지 배열에서 특정 메시지를 제거합니다.
 *
 * @param messages - pending 메시지 배열
 * @param messageId - 제거할 메시지의 id
 * @returns 메시지가 제거된 새 배열
 */
export const removePendingMessage = (
  messages: PendingMessage[],
  messageId: string | number,
): PendingMessage[] => {
  return messages.filter((msg) => msg.id !== messageId);
};
