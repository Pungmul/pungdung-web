import { clientApiRequest } from "@/core/api/client";

import {
  type ChangePasswordRequest,
  changePasswordRequestSchema,
  voidResponseSchema,
} from "./dto.schema";

export const updatePassword = async ({
  currentPassword,
  newPassword,
}: ChangePasswordRequest): Promise<void> =>
  clientApiRequest({
    url: "/api/auth/change-password",
    method: "POST",
    body: { currentPassword, newPassword },
    requestBodySchema: changePasswordRequestSchema,
    responseSchema: voidResponseSchema,
  });
