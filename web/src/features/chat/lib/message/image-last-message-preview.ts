/** 방 목록·알림 UI에 표시할 이미지 마지막 메시지 미리보기 문구 */
export const IMAGE_LAST_MESSAGE_PREVIEW = "이미지를 보냈습니다." as const;

const IMAGE_LAST_MESSAGE_PREVIEW_MARKER = "이미지" as const;

/**
 * `lastMessageContent`가 이미지 마지막 메시지 미리보기인지 판별한다.
 * REST·소켓·gap reconcile 등 ingress마다 문구 형태가 달라 substring으로 통일한다.
 */
export function isImageLastMessagePreview(
  content: string | null | undefined
): boolean {
  return content?.includes(IMAGE_LAST_MESSAGE_PREVIEW_MARKER) ?? false;
}
