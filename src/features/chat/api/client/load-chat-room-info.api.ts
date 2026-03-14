import { chatRoomDtoSchema } from "./dto.schema";
import {
  mapChatRoomDtoToDomain,
} from "../../lib/mappers";
import type { ChatRoom } from "../../types/domain/chat-room.types";

export const loadChatRoomInfo = async (roomId: string): Promise<ChatRoom> => {
  const response = await fetch(`/api/chats/${roomId}/info`, {
    credentials: "include",
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("채팅방 정보를 불러오는데 실패했습니다.");
  }

  const dto = chatRoomDtoSchema.parse(await response.json());
  return mapChatRoomDtoToDomain(dto);
};
