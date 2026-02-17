import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { postQueries } from "@/features/post";
import { Toast } from "@/shared/store";

import * as CommentApi from "../../api/client";
import { useCreateReplyAction } from "./useCreateReplyAction";

describe("useCreateReplyAction", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    vi.spyOn(CommentApi, "createReply").mockResolvedValue(undefined as never);
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

    const { result } = renderHook(() => useCreateReplyAction(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        postId: 9,
        comment: "답글",
        anonymity: true,
        parentId: 81,
      });
    });

    expect(vi.mocked(CommentApi.createReply).mock.calls[0]?.[0]).toEqual({
      postId: 9,
      comment: "답글",
      anonymity: true,
      parentId: 81,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: postQueries.detailKey(9),
    });
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it("실패하면 에러 토스트를 띄운다", async () => {
    vi.spyOn(CommentApi, "createReply").mockRejectedValueOnce(
      new Error("네트워크 오류")
    );

    const { result } = renderHook(() => useCreateReplyAction(), { wrapper });

    await act(async () => {
      await expect(
        result.current.mutateAsync({
          postId: 1,
          comment: "x",
          anonymity: false,
          parentId: 2,
        })
      ).rejects.toThrow("네트워크 오류");
    });

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalled();
      const arg = vi.mocked(Toast.show).mock.calls[0]?.[0];
      expect(arg?.type).toBe("error");
      expect(String(arg?.message)).toContain("대댓글 작성에 실패했습니다.");
      expect(String(arg?.message)).toContain("네트워크 오류");
    });
  });
});
