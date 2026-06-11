import { clientApiRequest } from "@/core/api/client";

import { voidResponseSchema } from "./dto.schema";

export const updatePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> =>
  clientApiRequest({
    url: "/api/auth/change-password",
    method: "POST",
    body: { currentPassword, newPassword },
    responseSchema: voidResponseSchema,
    headers: {
      "Content-Type": "application/json",
      credentials: "include",
    },
  });
