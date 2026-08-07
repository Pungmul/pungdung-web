import { ROUTE_FAILURE_CODE } from "@/core/config/route-failure-code";

import { AuthError } from "./auth-error.class";
import { clearTokenCookies } from "./clean-token-cookies";
import { reportRouteAppError } from "./report-route-app-error";

export function isUserFacingError(message: string): boolean {
  return (
    message.includes("401") ||
    message.includes("403") ||
    message.includes("404")
  );
}

export function proxyFailureError(
  error: unknown,
  fallbackMessage: string = "프록시 서버 처리중 에러가 발생했습니다."
) {
  const message =
    error instanceof Error && isUserFacingError(error.message)
      ? error.message
      : fallbackMessage;

  if (error instanceof AuthError) {
    clearTokenCookies();
    return Response.json(
      {
        code: "UNAUTHORIZED",
        message: "인증이 필요합니다.",
        response: null,
        isSuccess: false,
      },
      { status: 401 }
    );
  }

  reportRouteAppError({
    status: 500,
    code: ROUTE_FAILURE_CODE.PROXY_FAILURE,
    message,
  });
  return Response.json(
    {
      code: ROUTE_FAILURE_CODE.PROXY_FAILURE,
      message,
      response: null,
      isSuccess: false,
    },
    { status: 500 }
  );
}
