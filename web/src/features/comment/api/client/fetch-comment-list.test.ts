import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  clientApiRequest: vi.fn(),
}));

vi.mock("@/core/api/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/core/api/client")>();
  return {
    ...actual,
    clientApiRequest: mocks.clientApiRequest as typeof actual.clientApiRequest,
  };
});

import { ClientApiError, ClientMapperError } from "@/core/api/client";

import { fetchCommentList } from "./fetch-comment-list";

describe("fetchCommentList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("게시글 댓글 목록을 조회해 도메인 모델로 변환한다", async () => {
    mocks.clientApiRequest.mockResolvedValueOnce([
      {
        commentId: 1,
        postId: 10,
        parentId: null,
        content: "댓글입니다.",
        deleted: false,
        hide: false,
        anonymity: false,
        likedNum: 3,
        userName: "작성자",
        createdAt: "2026-01-01",
      },
    ]);

    const comments = await fetchCommentList(10);

    expect(mocks.clientApiRequest).toHaveBeenCalledWith(
      expect.objectContaining({ url: "/api/comments?postId=10" })
    );
    expect(comments).toMatchObject([
      {
        commentId: 1,
        postId: 10,
        parentId: null,
        content: "댓글입니다.",
        anonymity: false,
        likedNum: 3,
        userName: "작성자",
        replies: [],
      },
    ]);
  });

  it("ClientApiError는 그대로 전파한다", async () => {
    const apiError = new ClientApiError({
      message: "unauthorized",
      status: 401,
      code: "UNAUTHORIZED",
    });
    mocks.clientApiRequest.mockRejectedValueOnce(apiError);

    await expect(fetchCommentList(10)).rejects.toBe(apiError);
  });

  it("댓글 매핑 오류는 ClientMapperError로 감싼다", async () => {
    mocks.clientApiRequest.mockResolvedValueOnce([{}]);

    await expect(fetchCommentList(10)).rejects.toMatchObject({
      context: "fetchCommentList",
    } satisfies Partial<ClientMapperError>);
  });
});
