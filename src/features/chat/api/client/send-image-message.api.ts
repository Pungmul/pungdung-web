import { clientApiRequest } from "@/core/api/client";

import { chatMutationVoidResponseSchema } from "./dto.schema";

const IMAGE_UPLOAD_TIMEOUT_MS = 30 * 1000;

export const sendImageMessage = (
  roomId: string,
  formData: FormData
): Promise<void> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, IMAGE_UPLOAD_TIMEOUT_MS);

  return clientApiRequest({
    url: `/api/chats/${roomId}/images`,
    method: "POST",
    body: formData,
    signal: controller.signal,
    responseSchema: chatMutationVoidResponseSchema,
  }).finally(() => {
    clearTimeout(timeout);
  });
};
