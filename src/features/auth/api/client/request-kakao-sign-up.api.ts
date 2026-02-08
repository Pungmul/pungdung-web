import { clientApiRequest } from "@/core/api/client";

import {
  KakaoSignUpRequestForm,
  kakaoSignUpRequestSchema,
  voidResponseSchema,
} from "./dto.schema";

export const requestKakaoSignUp = async (
  data: KakaoSignUpRequestForm
): Promise<void> =>
  clientApiRequest({
    url: "/api/auth/kakao/sign-up",
    method: "POST",
    body: data,
    requestBodySchema: kakaoSignUpRequestSchema,
    responseSchema: voidResponseSchema,
  });
