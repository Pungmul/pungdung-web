import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as PromotionApi from "../../api/client";

import { usePublishPromotionForm } from "./usePublishPromotionForm";

describe("usePublishPromotionForm", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    vi.spyOn(PromotionApi, "savePromotionForm");
    vi.spyOn(PromotionApi, "publishPromotionForm").mockResolvedValue({
      formId: 9,
      publicKey: "abc123",
      publicUrl: "/x",
    } as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("저장 없이 받은 버전으로 게시하고 성공 시 formDraft는 재조회 없이, 내 폼 목록은 무효화한다", async () => {
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => usePublishPromotionForm(), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync({ formId: 9, expectedVersion: 4 });
    });

    expect(PromotionApi.savePromotionForm).not.toHaveBeenCalled();
    expect(PromotionApi.publishPromotionForm).toHaveBeenCalledWith(9, 4);

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["promotion", "formDraft", "9"],
        refetchType: "none",
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["myPromotionFormList"],
      });
    });
  });
});
