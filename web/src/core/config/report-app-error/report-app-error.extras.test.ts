import { beforeEach, describe, expect, it, vi } from "vitest";

import { ClientApiError } from "@/core/api/client/client-api-error";

import {
  captureException,
  lastScope,
  resetSentryMock,
} from "./report-app-error.test-setup";
import {
  createSocketBrokerError,
  createSocketContractError,
  reportAppError,
} from "./report-app-error";

vi.mock("@sentry/nextjs", () => import("./report-app-error.test-setup"));

describe("reportAppError extras", () => {
  beforeEach(() => {
    resetSentryMock();
  });

  it("가입 POST 4xx는 디바이스 extra만 넣고 payload 원문은 넣지 않는다", () => {
    reportAppError(
      new ClientApiError({
        message: "signup",
        status: 400,
        code: "SIGNUP_FAILED",
        payload: { email: "user@example.com", password: "secret", name: "홍길동" },
      }),
      { boundary: "api", endpoint: "/api/auth/sign-up", method: "POST" }
    );
    expect(lastScope.tags.critical_flow).toBe("signup");
    expect(lastScope.extras.payload).toBeUndefined();
    expect(lastScope.extras.email).toBeUndefined();
    expect(lastScope.extras.userAgent).toBeTypeOf("string");
    expect(lastScope.extras.display_mode).toBe("browser");
  });

  it("홍보 POST 4xx는 capture한다", () => {
    reportAppError(
      new ClientApiError({
        message: "promo",
        status: 400,
        code: "CREATE_FAILED",
      }),
      { boundary: "api", endpoint: "/api/promotions/create", method: "POST" }
    );
    expect(lastScope.tags.critical_flow).toBe("promotion_publish");
  });

  it("소켓 계약 실패는 프레임 본문 없이 capture한다", () => {
    reportAppError(
      createSocketContractError([{ path: ["content"], code: "invalid_type" }]),
      { boundary: "api", feature: "chat", endpoint: "/sub/chat/message/room-1" }
    );
    expect(lastScope.tags.error_kind).toBe("contract");
    expect(lastScope.extras.topic).toBe("/sub/chat/message/room-1");
    expect(lastScope.extras.zod_issues).toEqual([
      { path: "content", code: "invalid_type" },
    ]);
    expect(JSON.stringify(lastScope.extras)).not.toContain("안녕");
  });

  it("소켓 브로커 오류는 reason 문자열만 extra에 넣는다", () => {
    reportAppError(createSocketBrokerError("broker-nack"), { boundary: "api" });
    expect(lastScope.tags.error_kind).toBe("http");
    expect(lastScope.extras.broker_reason).toBe("broker-nack");
  });

  it("같은 Error 인스턴스는 한 번만 capture한다", () => {
    const error = new Error("once");
    reportAppError(error, { boundary: "section" });
    reportAppError(error, { boundary: "segment" });
    expect(captureException).toHaveBeenCalledTimes(1);
  });

  it("PROXY는 route에서만 capture하고 클라 훅에서는 drop한다", () => {
    const proxy = {
      message: "proxy",
      status: 500,
      code: "PROXY_FAILURE",
    };
    reportAppError(new ClientApiError(proxy), { boundary: "route" });
    expect(captureException).toHaveBeenCalledTimes(1);
    expect(lastScope.tags.boundary).toBe("route");
    expect(lastScope.extras.contract_layer).toBe("route_proxy");
    resetSentryMock();
    reportAppError(new ClientApiError(proxy), {
      boundary: "api",
      endpoint: "/api/posts",
    });
    expect(captureException).not.toHaveBeenCalled();
  });
});
