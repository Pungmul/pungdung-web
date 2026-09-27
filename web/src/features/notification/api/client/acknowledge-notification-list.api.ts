import { clientApiRequest } from "@/core/api/client";

import { notificationMutationVoidResponseSchema } from "./dto.schema";

export async function acknowledgeNotificationList(): Promise<void> {
  await clientApiRequest({
    url: "/api/notification/read",
    method: "PATCH",
    responseSchema: notificationMutationVoidResponseSchema,
  });
}
