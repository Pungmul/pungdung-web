import type { ChatRoomDto } from "../../types";

export const loadChatRoomInfo = async (
  roomId: string
): Promise<ChatRoomDto> => {
  const response = await fetch(`/api/chats/${roomId}/info`, {
    credentials: "include",
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("채팅방 정보를 불러오는데 실패했습니다.");
  }

  return response.json();
};
