import { z } from "zod";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { ClientApiError } from "@/core/api/client/client-api-error";
import { CLIENT_API_ERROR_CODE } from "@/core/api/client/constant";

import { captureException, resetSentryMock } from "./report-app-error.test-setup";
import { reportAppError } from "./report-app-error";
import type { ReportAppErrorContext } from "./report-app-error.types";

vi.mock("@sentry/nextjs", () => import("./report-app-error.test-setup"));

describe("reportAppError drop", () => {
  beforeEach(() => {
    resetSentryMock();
  });

  it.each([
    {
      name: "NETWORK_ERROR",
      error: new ClientApiError({
        message: "network",
        status: 0,
        code: CLIENT_API_ERROR_CODE.NETWORK_ERROR,
      }),
      ctx: { boundary: "api", endpoint: "/api/mock", method: "GET" },
    },
    {
      name: "AbortError",
      error: Object.assign(new Error("aborted"), { name: "AbortError" }),
      ctx: { boundary: "api" },
    },
    {
      name: "AuthError",
      error: Object.assign(new Error("auth"), { name: "AuthError" }),
      ctx: { boundary: "api" },
    },
    {
      name: "401",
      error: new ClientApiError({
        message: "unauth",
        status: 401,
        code: "UNAUTHORIZED",
      }),
      ctx: { boundary: "api", endpoint: "/api/auth/sign-up", method: "POST" },
    },
    {
      name: "403",
      error: new ClientApiError({
        message: "forbidden",
        status: 403,
        code: "FORBIDDEN",
      }),
      ctx: { boundary: "api", endpoint: "/api/promotions/create", method: "POST" },
    },
    {
      name: "일반 4xx",
      error: new ClientApiError({
        message: "bad",
        status: 400,
        code: "BAD_REQUEST",
      }),
      ctx: { boundary: "api", endpoint: "/api/chat/rooms", method: "POST" },
    },
    {
      name: "가입 GET 4xx",
      error: new ClientApiError({
        message: "dup",
        status: 400,
        code: "DUPLICATE",
      }),
      ctx: { boundary: "api", endpoint: "/api/auth/sign-up", method: "GET" },
    },
  ] satisfies { name: string; error: Error; ctx: ReportAppErrorContext }[])(
    "$name 은 capture하지 않는다",
    ({ error, ctx }) => {
      reportAppError(error, ctx);
      expect(captureException).not.toHaveBeenCalled();
    }
  );

  it("폼 ZodError는 capture하지 않는다", () => {
    const parsed = z.object({ email: z.string().email() }).safeParse({
      email: "x",
    });
    expect(parsed.success).toBe(false);
    if (parsed.success) {
      return;
    }
    reportAppError(parsed.error, { boundary: "section", feature: "auth" });
    expect(captureException).not.toHaveBeenCalled();
  });
});
