import { describe, expect, it, vi, beforeEach } from "vitest";

import type { PostDetailResponseDto } from "./dto.schema";
import { postDetailResponseDtoSchema } from "./dto.schema";

const mocks = vi.hoisted(() => ({
  clientApiRequest: vi.fn(),
  mapPostDetailDtoToArticle: vi.fn(),
}));

vi.mock("@/core/api/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/core/api/client")>();
  return {
    ...actual,
    clientApiRequest: mocks.clientApiRequest as typeof actual.clientApiRequest,
  };
});

vi.mock("../../lib/mappers/map-post-detail", () => ({
  mapPostDetailDtoToArticle: mocks.mapPostDetailDtoToArticle,
}));

import { ClientApiError, ClientMapperError } from "@/core/api/client";

import { fetchPostDetail } from "./fetch-post-detail";

import type { PostArticleDetail } from "../../types";
import { PostDeletedError } from "./post-deleted-error";

const sampleCommentDto = {
  commentId: 1,
  postId: 99,
  parentId: null,
  content: "c",
  userName: "u",
  createdAt: "",
  replies: [],
};

function normalDto(): PostDetailResponseDto {
  return postDetailResponseDtoSchema.parse({
    postId: 99,
    title: "제목",
    content: "본문",
    viewCount: 0,
    likedNum: 0,
    timeSincePosted: 0,
    timeSincePostedText: "",
    author: "",
    imageList: [],
    commentList: [sampleCommentDto],
    isLiked: false,
    isWriter: false,
    categoryId: 1,
  });
}

describe("fetchPostDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("매퍼 결과를 반환한다", async () => {
    const dto = normalDto();
    mocks.clientApiRequest.mockResolvedValueOnce(dto);
    const mapped = { postId: dto.postId } as PostArticleDetail;
    mocks.mapPostDetailDtoToArticle.mockReturnValueOnce(mapped);

    const result = await fetchPostDetail(99);

    expect(result).toBe(mapped);
    expect(mocks.mapPostDetailDtoToArticle).toHaveBeenCalledWith(dto);
  });

  it("삭제 껍데기 DTO이면 PostDeletedError를 던진다", async () => {
    const dto = postDetailResponseDtoSchema.parse({
      postId: 199,
      title: "삭제된 게시글",
      content: "",
      imageList: null,
      commentList: null,
      viewCount: null,
      isLiked: null,
      isWriter: null,
      likedNum: null,
      timeSincePosted: null,
      timeSincePostedText: null,
      author: null,
      authorUsername: "u@example.com",
      categoryId: null,
    });
    mocks.clientApiRequest.mockResolvedValueOnce(dto);

    await expect(fetchPostDetail(199)).rejects.toBeInstanceOf(PostDeletedError);
    expect(mocks.mapPostDetailDtoToArticle).not.toHaveBeenCalled();
  });

  it("clientApi가 ClientApiError이면 그대로 전파한다", async () => {
    const apiError = new ClientApiError({
      message: "unauthorized",
      status: 401,
      code: "UNAUTHORIZED",
    });
    mocks.clientApiRequest.mockRejectedValueOnce(apiError);

    await expect(fetchPostDetail(1)).rejects.toBe(apiError);
  });

  it("매퍼가 예외일 때 ClientMapperError로 감싼다", async () => {
    const dto = normalDto();
    mocks.clientApiRequest.mockResolvedValueOnce(dto);
    mocks.mapPostDetailDtoToArticle.mockImplementationOnce(() => {
      throw new Error("map failed");
    });

    let caught: unknown;
    try {
      await fetchPostDetail(99);
    } catch (e) {
      caught = e;
    }

    expect(caught).toBeInstanceOf(ClientMapperError);
    expect((caught as ClientMapperError).context).toBe("fetchPostDetail");
  });
});
