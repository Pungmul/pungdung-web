import { clientApiRequest } from "@/core/api/client";

import { chatMutationVoidResponseSchema } from "./dto.schema";

const TEXT_SEND_TIMEOUT_MS = 5000;

export const sendTextMessage = (
  roomId: string,
  message: { content: string; clientId: string }
): Promise<void> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, TEXT_SEND_TIMEOUT_MS);

  return clientApiRequest({
    url: `/api/chats/${roomId}/text`,
    method: "POST",
    body: message,
    signal: controller.signal,
    responseSchema: chatMutationVoidResponseSchema,
  }).finally(() => {
    clearTimeout(timeout);
  });
};
