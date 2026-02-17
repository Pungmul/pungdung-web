import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { postQueries } from "@/features/post";
import { Toast } from "@/shared/store";

import * as CommentApi from "../../api/client";
import { useCreateCommentAction } from "./useCreateCommentAction";

describe("useCreateCommentAction", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    vi.spyOn(CommentApi, "createComment").mockResolvedValue(undefined as never);
    vi.spyOn(Toast, "show");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("성공하면 해당 게시글 상세 쿼리를 무효화한다", async () => {
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateCommentAction(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        postId: 42,
        comment: "내용",
        anonymity: false,
      });
    });

    expect(vi.mocked(CommentApi.createComment).mock.calls[0]?.[0]).toEqual({
      postId: 42,
      comment: "내용",
      anonymity: false,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: postQueries.detailKey(42),
    });
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it("실패하면 에러 토스트를 띄운다", async () => {
    vi.spyOn(CommentApi, "createComment").mockRejectedValueOnce(
      new Error("네트워크 오류")
    );

    const { result } = renderHook(() => useCreateCommentAction(), { wrapper });

    await act(async () => {
      await expect(
        result.current.mutateAsync({
          postId: 1,
          comment: "x",
          anonymity: true,
        })
      ).rejects.toThrow("네트워크 오류");
    });

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalled();
      const arg = vi.mocked(Toast.show).mock.calls[0]?.[0];
      expect(arg?.type).toBe("error");
      expect(String(arg?.message)).toContain("댓글 작성에 실패했습니다.");
      expect(String(arg?.message)).toContain("네트워크 오류");
    });
  });
});
