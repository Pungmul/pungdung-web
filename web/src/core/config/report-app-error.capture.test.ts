import { beforeEach, describe, expect, it, vi } from "vitest";

import { ClientApiError } from "@/core/api/client/client-api-error";
import { ClientMapperError } from "@/core/api/client/client-mapper-error";
import { CLIENT_API_ERROR_CODE } from "@/core/api/client/constant";

import {
  captureException,
  lastScope,
  resetSentryMock,
} from "./report-app-error.test-setup";
import { reportAppError } from "./report-app-error";

vi.mock("@sentry/nextjs", () => import("./report-app-error.test-setup"));

describe("reportAppError capture", () => {
  beforeEach(() => {
    resetSentryMock();
  });

  it("INVALID_RESPONSE는 contract로 capture한다", () => {
    reportAppError(
      new ClientApiError({
        message: "invalid",
        status: 200,
        code: CLIENT_API_ERROR_CODE.INVALID_RESPONSE,
      }),
      { boundary: "api", endpoint: "/api/mock", method: "GET" }
    );
    expect(captureException).toHaveBeenCalledTimes(1);
    expect(lastScope.tags).toMatchObject({
      report_class: "failure",
      error_kind: "contract",
    });
    expect(lastScope.extras.payload).toBeUndefined();
    expect(lastScope.extras.topic).toBeUndefined();
    expect(lastScope.extras.contract_layer).toBe("client_envelope");
  });

  it("INVALID_RESPONSE_SCHEMA는 zod path만 extra에 넣는다", () => {
    reportAppError(
      new ClientApiError({
        message: "schema",
        status: 200,
        code: CLIENT_API_ERROR_CODE.INVALID_RESPONSE_SCHEMA,
        details: [{ path: ["count"], code: "invalid_type" }],
      }),
      { boundary: "api", endpoint: "/api/mock" }
    );
    expect(lastScope.extras.zod_issues).toEqual([
      { path: "count", code: "invalid_type" },
    ]);
  });

  it("INVALID_REQUEST_BODY는 status 0이어도 capture한다", () => {
    reportAppError(
      new ClientApiError({
        message: "body",
        status: 0,
        code: CLIENT_API_ERROR_CODE.INVALID_REQUEST_BODY,
        payload: JSON.stringify({ email: "user@example.com", password: "secret" }),
      }),
      { boundary: "api", endpoint: "/api/auth/sign-up", method: "POST" }
    );
    expect(lastScope.tags.error_kind).toBe("http");
    expect(lastScope.extras.payload).toBeUndefined();
    expect(lastScope.extras.payload_bytes).toBeTypeOf("number");
  });

  it("ClientMapperError와 5xx, 렌더 Error를 capture한다", () => {
    reportAppError(
      new ClientMapperError({ message: "map", context: "load-chat-logs" }),
      { boundary: "api", endpoint: "load-chat-logs" }
    );
    expect(lastScope.tags.error_kind).toBe("mapper");
    resetSentryMock();
    reportAppError(
      new ClientApiError({
        message: "down",
        status: 502,
        code: "UPSTREAM_BAD_GATEWAY",
      }),
      { boundary: "api", endpoint: "/api/posts", method: "GET" }
    );
    expect(lastScope.tags.error_kind).toBe("http");
    expect(lastScope.extras.http_status).toBe(502);
    resetSentryMock();
    reportAppError(new Error("render"), { boundary: "global" });
    expect(lastScope.tags).toMatchObject({
      error_kind: "unknown",
      boundary: "global",
    });
  });
});
