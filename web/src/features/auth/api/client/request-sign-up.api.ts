import { clientApiRequest } from "@/core/api/client";

import {
  SignUpRequestForm,
  signUpRequestSchema,
  voidResponseSchema,
} from "./dto.schema";

export const requestSignUp = async (data: SignUpRequestForm): Promise<void> =>
  clientApiRequest({
    url: "/api/auth/sign-up",
    method: "POST",
    body: data,
    requestBodySchema: signUpRequestSchema,
    responseSchema: voidResponseSchema,
  });
