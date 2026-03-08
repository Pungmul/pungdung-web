/** 이미지 업로드 타임아웃 (30초) */
const IMAGE_UPLOAD_TIMEOUT_MS = 30 * 1000;

export const sendImageMessage = async (
  roomId: string,
  formData: FormData,
): Promise<void> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, IMAGE_UPLOAD_TIMEOUT_MS);

  const signal = controller.signal;
  const response = await fetch(`/api/chats/${roomId}/images`, {
    credentials: "include",
    method: "POST",
    signal,
    body: formData,
  });

  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error("이미지 전송에 실패했습니다.");
  }
};
