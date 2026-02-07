import { AuthError } from "./auth-error.class";
import { clearTokenCookies } from "./clean-token-cookies";

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

  return Response.json(
    { code: "PROXY_FAILURE", message, response: null, isSuccess: false },
    { status: 500 }
  );
}
