import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ClientMapperError } from "@/core/api/client/client-mapper-error";
import { CLIENT_API_ERROR_CODE } from "@/core/api/client/constant";

import { prefetchBoardInfoList } from "./prefetch-board-info-list";

const PROMOTE_BOARD = {
  id: "promote",
  parentId: null,
  name: "홍보 게시판",
  description: "공연 모집 정보를 공유하는 게시판입니다",
};

const CLUB_BOARD = {
  id: "club",
  parentId: null,
  name: "동아리 게시판",
  description: "소속 동아리의 게시글을 확인하는 게시판입니다",
};

function okEnvelope(response: unknown) {
  return {
    code: "OK",
    message: "ok",
    isSuccess: true,
    response,
  };
}

describe("prefetchBoardInfoList", () => {
  const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://api.example.com";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(okEnvelope([])),
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    if (originalBaseUrl === undefined) {
      delete process.env.NEXT_PUBLIC_BASE_URL;
    } else {
      process.env.NEXT_PUBLIC_BASE_URL = originalBaseUrl;
    }
  });

  it("NEXT_PUBLIC_BASE_URL이 없으면 ClientMapperError로 싸여 실패하고 cause에 안내가 담긴다", async () => {
    delete process.env.NEXT_PUBLIC_BASE_URL;

    try {
      await prefetchBoardInfoList();
      expect.fail("should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ClientMapperError);
      expect(error).toMatchObject({
        context: "prefetchBoardInfoList",
        failureCause: expect.objectContaining({
          message: expect.stringContaining("NEXT_PUBLIC_BASE_URL"),
        }),
      });
    }
  });

  it("base URL 끝 슬래시 여부와 관계없이 /api/boards 로 요청한다", async () => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://x.example.com/";
    const fetchMock = vi.mocked(globalThis.fetch);

    await prefetchBoardInfoList();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://x.example.com/api/boards",
      expect.objectContaining({
        next: expect.objectContaining({ revalidate: 900 }),
      })
    );

    process.env.NEXT_PUBLIC_BASE_URL = "https://y.example.com";
    await prefetchBoardInfoList();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://y.example.com/api/boards",
      expect.objectContaining({
        next: expect.objectContaining({ revalidate: 900 }),
      })
    );
  });

  it("성공 응답이면 매핑된 목록 끝에 CLUB_BOARD와 PROMOTE_BOARD를 붙인다", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(
        okEnvelope([
          {
            id: 10,
            parentId: null,
            name: "자유",
            description: "desc",
          },
        ])
      ),
    } as unknown as Response);

    const result = await prefetchBoardInfoList();

    expect(result).toEqual([
      {
        id: 10,
        parentId: null,
        name: "자유",
        description: "desc",
      },
      CLUB_BOARD,
      PROMOTE_BOARD,
    ]);
  });

  it("HTTP 오류면 ClientApiError로 실패한다", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue(
        okEnvelope([{ id: 1, parentId: null, name: "n", description: "d" }])
      ),
    } as unknown as Response);

    await expect(prefetchBoardInfoList()).rejects.toMatchObject({
      name: "ClientApiError",
      status: 500,
    });
  });

  it("JSON 파싱 실패 시 ClientApiError(INVALID_RESPONSE)로 실패한다", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockRejectedValue(new Error("parse fail")),
    } as unknown as Response);

    await expect(prefetchBoardInfoList()).rejects.toMatchObject({
      name: "ClientApiError",
      code: CLIENT_API_ERROR_CODE.INVALID_RESPONSE,
    });
  });

  it("response 스키마가 맞지 않으면 ClientApiError(INVALID_RESPONSE_SCHEMA)로 실패한다", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(okEnvelope([{ id: "bad" }])),
    } as unknown as Response);

    await expect(prefetchBoardInfoList()).rejects.toMatchObject({
      name: "ClientApiError",
      code: CLIENT_API_ERROR_CODE.INVALID_RESPONSE_SCHEMA,
    });
  });
});
