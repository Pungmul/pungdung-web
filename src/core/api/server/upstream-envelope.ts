import type { ValidateUpstreamResult } from "./type";
import { upstreamEnvelopeSchema } from "./type";

export async function validateUpstreamJsonResponse(
  response: Response
): Promise<ValidateUpstreamResult> {
  const raw = await response.json().catch(() => null);

  if (raw === null) {
    return {
      ok: false,
      error: {
        status: 502,
        body: {
          code: "UPSTREAM_INVALID_JSON",
          message: "서버 응답을 해석할 수 없습니다.",
          response: null,
          isSuccess: false,
        },
      },
    };
  }

  const parsed = upstreamEnvelopeSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        status: 502,
        body: {
          code: "UPSTREAM_INVALID_RESPONSE",
          message: "서버 응답 형식이 올바르지 않습니다.",
          response: null,
          isSuccess: false,
        },
      },
    };
  }

  return {
    ok: true,
    data: parsed.data,
  };
}

export async function createValidatedUpstreamResponse(
  response: Response
): Promise<Response> {
  const parsed = await validateUpstreamJsonResponse(response);
  if (!parsed.ok) {
    return Response.json(parsed.error.body, { status: parsed.error.status });
  }

  return Response.json(parsed.data, { status: response.status });
}
