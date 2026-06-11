import { clientApiRequest } from "@/core/api/client";

import {
  PasswordResetEmailRequest,
  passwordResetEmailRequestSchema,
  voidResponseSchema,
} from "./dto.schema";

export const requestPasswordResetEmail = async (
  data: PasswordResetEmailRequest
): Promise<void> =>
  clientApiRequest({
    url: "/api/auth/reset-password/send-link",
    method: "POST",
    body: data,
    requestBodySchema: passwordResetEmailRequestSchema,
    responseSchema: voidResponseSchema,
  });
