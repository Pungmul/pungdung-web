import { clientApiRequest } from "@/core/api/client";

import { chatMutationVoidResponseSchema } from "./dto.schema";

export const exitChat = (roomId: string) =>
  clientApiRequest({
    url: `/api/chats/${roomId}/exit`,
    method: "POST",
    responseSchema: chatMutationVoidResponseSchema,
  });
