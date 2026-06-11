import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { postQueries } from "@/features/post";
import { Toast } from "@/shared/store";

import * as CommentApi from "../../api/client";
import { useDeleteCommentAction } from "./useDeleteCommentAction";

describe("useDeleteCommentAction", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    vi.spyOn(CommentApi, "deleteComment").mockResolvedValue(undefined as never);
    vi.spyOn(Toast, "show");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("성공하면 상세 쿼리를 무효화하고 성공 토스트를 띄운다", async () => {
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteCommentAction(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ commentId: 5, postId: 100 });
    });

    expect(vi.mocked(CommentApi.deleteComment).mock.calls[0]?.[0]).toBe(5);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: postQueries.detailKey(100),
    });
    expect(Toast.show).toHaveBeenCalledWith({
      message: "삭제되었습니다.",
      type: "success",
    });
  });

  it("실패하면 에러 토스트를 띄운다", async () => {
    vi.spyOn(CommentApi, "deleteComment").mockRejectedValueOnce(
      new Error("삭제 불가")
    );

    const { result } = renderHook(() => useDeleteCommentAction(), { wrapper });

    await act(async () => {
      await expect(
        result.current.mutateAsync({ commentId: 1, postId: 7 })
      ).rejects.toThrow("삭제 불가");
    });

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalled();
      const arg = vi.mocked(Toast.show).mock.calls[0]?.[0];
      expect(arg?.type).toBe("error");
      expect(String(arg?.message)).toContain("삭제에 실패했습니다.");
      expect(String(arg?.message)).toContain("삭제 불가");
    });
  });
});
