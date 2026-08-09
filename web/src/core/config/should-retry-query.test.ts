import { describe, expect, it, vi } from "vitest";

import { ClientApiError } from "@/core/api/client/client-api-error";
import { CLIENT_API_ERROR_CODE } from "@/core/api/client/constant";

import { shouldRetryQuery } from "./should-retry-query";

function apiError(status: number, code: string) {
  return new ClientApiError({ message: code, status, code });
}

describe("shouldRetryQuery", () => {
  it.each([
    {
      name: "400",
      error: apiError(400, "BAD_REQUEST"),
      count: 0,
      retry: false,
    },
    {
      name: "401",
      error: apiError(401, "UNAUTHORIZED"),
      count: 0,
      retry: false,
    },
    { name: "403", error: apiError(403, "FORBIDDEN"), count: 0, retry: false },
    { name: "404", error: apiError(404, "NOT_FOUND"), count: 0, retry: false },
    { name: "429", error: apiError(429, "RATE_LIMIT"), count: 0, retry: false },
    {
      name: "499",
      error: apiError(499, "CLIENT_CLOSED"),
      count: 0,
      retry: false,
    },
    {
      name: "요청 바디",
      error: apiError(0, CLIENT_API_ERROR_CODE.INVALID_REQUEST_BODY),
      count: 0,
      retry: false,
    },
    {
      name: "응답 스키마",
      error: apiError(200, CLIENT_API_ERROR_CODE.INVALID_RESPONSE_SCHEMA),
      count: 0,
      retry: false,
    },
    {
      name: "AuthError",
      error: Object.assign(new Error("auth"), { name: "AuthError" }),
      count: 0,
      retry: false,
    },
    {
      name: "오프라인 네트워크",
      error: apiError(0, CLIENT_API_ERROR_CODE.NETWORK_ERROR),
      count: 0,
      retry: false,
      offline: true,
    },
    {
      name: "오프라인",
      error: apiError(502, "UPSTREAM"),
      count: 0,
      retry: false,
      offline: true,
    },
    { name: "502", error: apiError(502, "UPSTREAM"), count: 0, retry: true },
    {
      name: "502 한도",
      error: apiError(502, "UPSTREAM"),
      count: 3,
      retry: false,
    },
    {
      name: "네트워크",
      error: apiError(0, CLIENT_API_ERROR_CODE.NETWORK_ERROR),
      count: 1,
      retry: true,
    },
    {
      name: "클라 타임아웃",
      error: apiError(0, CLIENT_API_ERROR_CODE.CLIENT_TIMEOUT),
      count: 0,
      retry: false,
    },
  ])("$name", ({ error, count, retry, offline }) => {
    if (offline) {
      vi.stubGlobal("navigator", { ...navigator, onLine: false });
    }
    expect(shouldRetryQuery(count, error)).toBe(retry);
    if (offline) {
      vi.unstubAllGlobals();
    }
  });
});
