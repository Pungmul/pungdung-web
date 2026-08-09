import { afterEach, describe, expect, it, vi } from "vitest";

import { ClientApiError } from "@/core/api/client/client-api-error";
import { CLIENT_API_ERROR_CODE } from "@/core/api/client/constant";

import { loadBoardInfoListResult } from "./load-board-info-list-result";

vi.mock("./prefetch-board-info-list", () => ({
  prefetchBoardInfoList: vi.fn(),
}));

vi.mock("@/core/config/report-app-error", () => ({
  reportAppError: vi.fn(),
}));

import { prefetchBoardInfoList } from "./prefetch-board-info-list";
import { reportAppError } from "@/core/config/report-app-error";

describe("loadBoardInfoListResult", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("성공이면 ok data이다", async () => {
    vi.mocked(prefetchBoardInfoList).mockResolvedValueOnce([
      {
        id: 1,
        parentId: null,
        name: "자유",
        description: "d",
        isPublic: true,
      },
    ]);

    await expect(loadBoardInfoListResult()).resolves.toEqual({
      ok: true,
      data: [
        {
          id: 1,
          parentId: null,
          name: "자유",
          description: "d",
          isPublic: true,
        },
      ],
    });
    expect(reportAppError).not.toHaveBeenCalled();
  });

  it("실패면 ok false이고 reportAppError를 호출한다", async () => {
    const error = new ClientApiError({
      message: "schema",
      status: 200,
      code: CLIENT_API_ERROR_CODE.INVALID_RESPONSE_SCHEMA,
    });
    vi.mocked(prefetchBoardInfoList).mockRejectedValueOnce(error);

    await expect(loadBoardInfoListResult()).resolves.toEqual({
      ok: false,
      errorKind: "contract",
    });
    expect(reportAppError).toHaveBeenCalledWith(error, {
      boundary: "rsc",
      feature: "board",
      endpoint: "/api/boards",
      method: "GET",
    });
  });
});
