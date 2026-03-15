import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import {
  mapChatRoomDtoToDomain,
} from "../../lib/mappers";
import type { ChatRoom } from "../../types/domain/chat-room.types";
import { chatRoomDtoSchema } from "./dto.schema";

export const loadChatRoomInfo = (roomId: string): Promise<ChatRoom> =>
  withResponseMapper({
    context: "loadChatRoomInfo",
    fetchDto: () =>
      clientApiRequest({
        url: `/api/chats/${roomId}/info`,
        method: "GET",
        responseSchema: chatRoomDtoSchema,
      }),
    map: mapChatRoomDtoToDomain,
  });
