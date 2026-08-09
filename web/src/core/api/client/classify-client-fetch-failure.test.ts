import { describe, expect, it } from "vitest";

import { getClientFetchFailureCode } from "./classify-client-fetch-failure";
import {
  CLIENT_API_ERROR_CODE,
  CLIENT_FETCH_TIMEOUT_ABORT_REASON,
} from "./constant";

describe("getClientFetchFailureCode", () => {
  it("Failed to fetch는 NETWORK_ERROR이다", () => {
    expect(getClientFetchFailureCode(new TypeError("Failed to fetch"))).toBe(
      CLIENT_API_ERROR_CODE.NETWORK_ERROR
    );
  });

  it("TimeoutError는 CLIENT_TIMEOUT이다", () => {
    expect(
      getClientFetchFailureCode(new DOMException("timeout", "TimeoutError"))
    ).toBe(CLIENT_API_ERROR_CODE.CLIENT_TIMEOUT);
  });

  it("abort(timeout)은 CLIENT_TIMEOUT이다", () => {
    const controller = new AbortController();
    controller.abort(CLIENT_FETCH_TIMEOUT_ABORT_REASON);
    expect(
      getClientFetchFailureCode(
        new DOMException("aborted", "AbortError"),
        controller.signal
      )
    ).toBe(CLIENT_API_ERROR_CODE.CLIENT_TIMEOUT);
  });

  it("reason 없는 AbortError는 NETWORK_ERROR이다", () => {
    const controller = new AbortController();
    controller.abort();
    expect(
      getClientFetchFailureCode(
        new DOMException("aborted", "AbortError"),
        controller.signal
      )
    ).toBe(CLIENT_API_ERROR_CODE.NETWORK_ERROR);
  });
});
