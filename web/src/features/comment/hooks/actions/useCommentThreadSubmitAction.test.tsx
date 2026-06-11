import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ImageObject } from "@/shared/types/image/type";
import { Toast } from "@/shared/store";

import type { Comment } from "../../types";
import * as CommentApi from "../../api/client";

import { useCommentThreadSubmitAction } from "./useCommentThreadSubmitAction";

const profile: ImageObject = {
  id: 0,
  originalFilename: "",
  convertedFileName: "",
  fullFilePath: "",
  fileType: "image/jpeg",
  fileSize: 0,
  createdAt: "",
};

function makeComment(overrides: Partial<Comment> = {}): Comment {
  return {
    commentId: 9,
    postId: 2,
    parentId: null,
    content: "parent",
    userName: "u",
    profile,
    createdAt: "",
    replies: [],
    ...overrides,
  };
}

describe("useCommentThreadSubmitAction", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    vi.spyOn(CommentApi, "createComment").mockResolvedValue(undefined as never);
    vi.spyOn(CommentApi, "createReply").mockResolvedValue(undefined as never);
    vi.spyOn(Toast, "show");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("submitFromComposer: 댓글만 작성할 때 createComment를 호출하고 입력을 먼저 비운다", async () => {
    const resetCommentInput = vi.fn();
    const reset = vi.fn();
    const setReplyTarget = vi.fn();

    const { result } = renderHook(
      () =>
        useCommentThreadSubmitAction({
          postId: 30,
          replyTarget: null,
          setReplyTarget,
          resetCommentInput,
          reset,
        }),
      { wrapper }
    );

    await act(async () => {
      await result.current.submitFromComposer({
        content: "  본문  ",
        anonymity: false,
      });
    });

    expect(
      resetCommentInput.mock.invocationCallOrder[0]!
    ).toBeLessThan(reset.mock.invocationCallOrder[0]!);

    expect(reset).toHaveBeenCalledWith({ content: "", anonymity: false });

    expect(
      reset.mock.invocationCallOrder[0]!
    ).toBeLessThan(
      vi.mocked(CommentApi.createComment).mock.invocationCallOrder[0]!
    );

    expect(vi.mocked(CommentApi.createComment).mock.calls[0]?.[0]).toEqual({
      postId: 30,
      comment: "  본문  ",
      anonymity: false,
    });

    expect(CommentApi.createReply).not.toHaveBeenCalled();
    expect(setReplyTarget).not.toHaveBeenCalled();
  });

  it("submitFromComposer: 답글 대상이 있으면 createReply 후 대상을 해제한다", async () => {
    const resetCommentInput = vi.fn();
    const reset = vi.fn();
    const setReplyTarget = vi.fn();

    const { result } = renderHook(
      () =>
        useCommentThreadSubmitAction({
          postId: 30,
          replyTarget: makeComment({ commentId: 14 }),
          setReplyTarget,
          resetCommentInput,
          reset,
        }),
      { wrapper }
    );

    await act(async () => {
      await result.current.submitFromComposer({
        content: "답",
        anonymity: true,
      });
    });

    expect(vi.mocked(CommentApi.createReply).mock.calls[0]?.[0]).toEqual({
      postId: 30,
      comment: "답",
      anonymity: true,
      parentId: 14,
    });
    expect(CommentApi.createComment).not.toHaveBeenCalled();
    expect(setReplyTarget).toHaveBeenCalledWith(null);
  });

  it("submitReplyFromComposer: 답글 대상이 없으면 토스트만 띄우고 API를 호출하지 않는다", async () => {
    const { result } = renderHook(
      () =>
        useCommentThreadSubmitAction({
          postId: 1,
          replyTarget: null,
          setReplyTarget: vi.fn(),
          resetCommentInput: vi.fn(),
          reset: vi.fn(),
        }),
      { wrapper }
    );

    await act(async () => {
      await result.current.submitReplyFromComposer({
        content: "x",
        anonymity: false,
      });
    });

    expect(Toast.show).toHaveBeenCalledWith({
      message: "답글 대상이 없습니다.",
      type: "error",
    });
    expect(CommentApi.createComment).not.toHaveBeenCalled();
    expect(CommentApi.createReply).not.toHaveBeenCalled();
  });
});
