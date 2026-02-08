import { clientApiRequest } from "@/core/api/client";

import {
  ResetPasswordRequest,
  resetPasswordRequestSchema,
  ResetPasswordResponse,
  resetPasswordResponseSchema,
} from "./dto.schema";

export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> =>
  clientApiRequest({
    url: "/api/auth/reset-password",
    method: "POST",
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
    body: data,
    requestBodySchema: resetPasswordRequestSchema,
    responseSchema: resetPasswordResponseSchema,
  });
