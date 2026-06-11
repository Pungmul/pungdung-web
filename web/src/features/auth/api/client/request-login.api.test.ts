import { beforeEach,describe, expect, it } from "vitest";

import { requestLogin } from "./request-login.api";

import { authLoginHandlers } from "@/app/api/auth/login/__mock__/handlers";
import { server } from "@/test/msw-server";

describe("requestLogin", () => {
  beforeEach(() => {
    server.resetHandlers();
    server.use(...authLoginHandlers);
  });

  it("returns success message on HTTP 200", async () => {
    const res = await requestLogin({
      loginId: "any@test.com",
      password: "Password12",
    });
    expect(res).toBe("로그인이 정상적으로 완료됐습니다.");
  });
});
