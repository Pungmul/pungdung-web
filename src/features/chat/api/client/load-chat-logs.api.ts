import type { ChatMessageDto } from "../../types";

export const loadChatLogs = async (
  roomId: string,
  page: number = 2
): Promise<ChatMessageDto> => {
  const response = await fetch(`/api/chats/${roomId}/chatlog?page=${page}`, {
    credentials: "include",
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("채팅 로그를 불러오는데 실패했습니다.");
  }

  const data: ChatMessageDto = await response.json();
  return { ...data, pageNum: page };
};
