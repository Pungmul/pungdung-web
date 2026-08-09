import { z } from "zod";

import { afterEach, describe, expect, it, vi } from "vitest";

import { ClientApiError } from "./client-api-error";
import { clientApiRequest } from "./client-api-request";
import { CLIENT_API_ERROR_CODE, CLIENT_FETCH_TIMEOUT_ABORT_REASON } from "./constant";

describe("clientApiRequest", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("응답이 유효하지 않으면 INVALID_RESPONSE 오류를 던진다", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ foo: "bar" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    await expect(
      clientApiRequest({
        url: "/api/mock",
        responseSchema: z.unknown(),
      })
    ).rejects.toMatchObject({ code: CLIENT_API_ERROR_CODE.INVALID_RESPONSE });
  });

  it("응답 스키마가 유효하지 않으면 INVALID_RESPONSE_SCHEMA 오류를 던진다", async () => {
    vi.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            code: "SUCCESS",
            message: "ok",
            response: { count: "x" },
            isSuccess: true,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        )
      )
    );

    await expect(
      clientApiRequest({
        url: "/api/mock",
        responseSchema: z.object({ count: z.number() }),
      })
    ).rejects.toBeInstanceOf(ClientApiError);

    await expect(
      clientApiRequest({
        url: "/api/mock",
        responseSchema: z.object({ count: z.number() }),
      })
    ).rejects.toMatchObject({
      code: CLIENT_API_ERROR_CODE.INVALID_RESPONSE_SCHEMA,
    });
  });

  it("Failed to fetch는 NETWORK_ERROR이다", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(
      new TypeError("Failed to fetch")
    );

    await expect(
      clientApiRequest({
        url: "/api/mock",
        responseSchema: z.unknown(),
      })
    ).rejects.toMatchObject({
      code: CLIENT_API_ERROR_CODE.NETWORK_ERROR,
    });
  });

  it("abort(timeout)은 CLIENT_TIMEOUT이다", async () => {
    const controller = new AbortController();
    controller.abort(CLIENT_FETCH_TIMEOUT_ABORT_REASON);
    vi.spyOn(global, "fetch").mockRejectedValue(
      new DOMException("The operation was aborted.", "AbortError")
    );

    await expect(
      clientApiRequest({
        url: "/api/mock",
        responseSchema: z.unknown(),
        signal: controller.signal,
      })
    ).rejects.toMatchObject({
      code: CLIENT_API_ERROR_CODE.CLIENT_TIMEOUT,
    });
  });
});
