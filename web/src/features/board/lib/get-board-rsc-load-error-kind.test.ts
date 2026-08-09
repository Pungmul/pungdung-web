import { describe, expect, it } from "vitest";

import { ClientApiError } from "@/core/api/client/client-api-error";
import { ClientMapperError } from "@/core/api/client/client-mapper-error";
import { CLIENT_API_ERROR_CODE } from "@/core/api/client/constant";

import { getBoardRscLoadErrorKind } from "./get-board-rsc-load-error-kind";

describe("getBoardRscLoadErrorKind", () => {
  it("ClientMapperError는 contract이다", () => {
    expect(
      getBoardRscLoadErrorKind(
        new ClientMapperError({
          message: "map",
          context: "prefetchBoardInfoList",
        })
      )
    ).toBe("contract");
  });

  it("INVALID_RESPONSE_SCHEMA는 contract이다", () => {
    expect(
      getBoardRscLoadErrorKind(
        new ClientApiError({
          message: "schema",
          status: 200,
          code: CLIENT_API_ERROR_CODE.INVALID_RESPONSE_SCHEMA,
        })
      )
    ).toBe("contract");
  });

  it("HTTP 5xx ClientApiError는 http이다", () => {
    expect(
      getBoardRscLoadErrorKind(
        new ClientApiError({
          message: "fail",
          status: 500,
          code: "UPSTREAM_ERROR",
        })
      )
    ).toBe("http");
  });

  it("그 외는 unknown이다", () => {
    expect(getBoardRscLoadErrorKind(new Error("x"))).toBe("unknown");
  });
});
