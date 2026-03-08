export const sendTextMessage = async (
  roomId: string,
  message: { content: string }
): Promise<void> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);
  const signal = controller.signal;
  const response = await fetch(`/api/chats/${roomId}/text`, {
    credentials: "include",
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error("메시지 전송에 실패했습니다.");
  }
};
