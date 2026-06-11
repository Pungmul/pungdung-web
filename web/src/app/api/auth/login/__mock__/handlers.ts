import { http, HttpResponse } from "msw";

/** MSW용 로그인 성공 응답 (`response`는 사용자 안내 메시지) */
export const loginSuccessResponseBody =
  "로그인이 정상적으로 완료됐습니다." as const;

/** 상대·절대 URL 모두에서 `pathname`으로 매칭 (jsdom origin 차이 흡수) */
export const authLoginHandlers = [
  http.post(
    ({ request }) => new URL(request.url).pathname === "/api/auth/login",
    () =>
      HttpResponse.json({
        code: "SUCCESS",
        message: "로그인 성공",
        response: loginSuccessResponseBody,
        isSuccess: true,
      })
  ),
];
