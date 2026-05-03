import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { chatRoomDtoSchema } from "./dto.schema";
import {
  mapChatRoomDtoToDomain,
} from "../../lib/mappers";
import type { ChatRoom } from "../../types/chat-room.types";

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
