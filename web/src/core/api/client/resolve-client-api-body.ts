import { z } from "zod";

import { ClientApiError } from "./client-api-error";
import { CLIENT_API_ERROR_CODE } from "./constant";
import { clientApiEnvelopeSchema } from "./type";

/** fetch/XHR 등으로 받은 본문 JSON을 envelope 규약에 맞게 검증하고 `responseSchema`까지 통과시킵니다. */
export function resolveClientApiBody<TResponse>(
  raw: unknown,
  httpOk: boolean,
  httpStatus: number,
  responseSchema: z.ZodType<TResponse>
): TResponse {
  const envelope = clientApiEnvelopeSchema.safeParse(raw);

  if (!envelope.success) {
    throw new ClientApiError({
      status: httpStatus,
      code: CLIENT_API_ERROR_CODE.INVALID_RESPONSE,
      message: "응답 형식이 올바르지 않습니다.",
      payload: raw ? JSON.stringify(raw) : undefined,
      details: envelope.error.issues,
    });
  }

  if (!httpOk || !envelope.data.isSuccess) {
    throw new ClientApiError({
      status: httpStatus,
      code: envelope.data.code,
      message: envelope.data.message,
      payload: JSON.stringify(envelope.data),
    });
  }

  const parsed = responseSchema.safeParse(envelope.data.response);
  if (!parsed.success) {
    throw new ClientApiError({
      status: httpStatus,
      code: CLIENT_API_ERROR_CODE.INVALID_RESPONSE_SCHEMA,
      message: "데이터 형식이 올바르지 않습니다.",
      payload: JSON.stringify(envelope.data.response),
      details: parsed.error.issues,
    });
  }

  return parsed.data;
}
