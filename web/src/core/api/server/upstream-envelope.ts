import { ROUTE_FAILURE_CODE } from "@/core/config/route-failure-code";

import { reportRouteAppError } from "./report-route-app-error";
import type { ValidateUpstreamResult } from "./type";
import { upstreamEnvelopeSchema } from "./type";

export async function validateUpstreamJsonResponse(
  response: Response
): Promise<ValidateUpstreamResult> {
  const raw = await response.json().catch(() => null);

  if (raw === null) {
    return invalidUpstreamResult(
      ROUTE_FAILURE_CODE.UPSTREAM_INVALID_JSON,
      "서버 응답을 해석할 수 없습니다."
    );
  }

  const parsed = upstreamEnvelopeSchema.safeParse(raw);
  if (!parsed.success) {
    return invalidUpstreamResult(
      ROUTE_FAILURE_CODE.UPSTREAM_INVALID_RESPONSE,
      "서버 응답 형식이 올바르지 않습니다."
    );
  }

  return {
    ok: true,
    data: parsed.data,
  };
}

export async function createValidatedUpstreamResponse(
  response: Response,
  options?: {
    transformEnvelopeResponse?: (response: unknown) => unknown;
  }
): Promise<Response> {
  const parsed = await validateUpstreamJsonResponse(response);
  if (!parsed.ok) {
    return Response.json(parsed.error.body, { status: parsed.error.status });
  }

  const envelope = parsed.data;
  const transformedResponse = options?.transformEnvelopeResponse
    ? options.transformEnvelopeResponse(envelope.response)
    : envelope.response;

  return Response.json(
    {
      ...envelope,
      response: transformedResponse,
    },
    { status: response.status }
  );
}

function invalidUpstreamResult(
  code: string,
  message: string
): Extract<ValidateUpstreamResult, { ok: false }> {
  reportRouteAppError({
    status: 502,
    code,
    message,
  });
  return {
    ok: false,
    error: {
      status: 502,
      body: {
        code,
        message,
        response: null,
        isSuccess: false,
      },
    },
  };
}
