import { clientApiRequest } from "@/core/api/client";

import { chatMutationVoidResponseSchema } from "./dto.schema";

export const inviteUser = (
  roomId: string,
  data: { newUsernameList: string[] }
) =>
  clientApiRequest({
    url: `/api/chats/${roomId}/invites`,
    method: "POST",
    body: data,
    responseSchema: chatMutationVoidResponseSchema,
  });
