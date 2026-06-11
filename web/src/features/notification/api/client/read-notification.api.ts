import { clientApiRequest } from "@/core/api/client";

import { notificationMutationVoidResponseSchema } from "./dto.schema";

export async function markNotificationAsRead(logId: number): Promise<void> {
  await clientApiRequest({
    url: `/api/notification/${logId}/read`,
    method: "PATCH",
    responseSchema: notificationMutationVoidResponseSchema,
  });
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await clientApiRequest({
    url: "/api/notification/read-all",
    method: "PATCH",
    responseSchema: notificationMutationVoidResponseSchema,
  });
}
