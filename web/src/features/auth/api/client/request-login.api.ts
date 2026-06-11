import { clientApiRequest } from "@/core/api/client";

import {
  type LoginRequest,
  loginRequestSchema,
  loginResponseSchema,
} from "./dto.schema";

export async function requestLogin({ loginId, password }: LoginRequest): Promise<string> {
  return clientApiRequest({
    url: "/api/auth/login",
    method: "POST",
    body: { loginId, password },
    requestBodySchema: loginRequestSchema,
    responseSchema: loginResponseSchema,
  });
}
