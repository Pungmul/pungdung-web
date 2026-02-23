import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as PromotionApi from "../../api/client";
import type { PromotionFormSavePayload } from "../../types";

import { usePublishPromotionForm } from "./usePublishPromotionForm";

const minimalForm = (): PromotionFormSavePayload => ({
  expectedVersion: 1,
  snapshot: {
    title: "t",
    description: "",
    questions: [],
    formType: "PERFORMANCE",
    startAt: "2025-01-01T00:00:00",
    limitNum: null,
    address: null,
    performanceImageIdList: null,
  },
});

describe("usePublishPromotionForm", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    vi.spyOn(PromotionApi, "savePromotionForm").mockResolvedValue({
      formId: 9,
      version: 4,
      autosavedAt: "2025-01-01T00:00:00Z",
    });
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

  it("저장 후 게시를 호출하고 성공 시 formDraft·내 폼 목록 무효화한다", async () => {
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => usePublishPromotionForm(), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync({
        formId: 9,
        form: minimalForm(),
      });
    });

    expect(PromotionApi.savePromotionForm).toHaveBeenCalledWith(
      9,
      expect.objectContaining({ expectedVersion: 1 })
    );
    expect(PromotionApi.publishPromotionForm).toHaveBeenCalledWith(9, 4);

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["promotion", "formDraft", "9"],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["myPromotionFormList"],
      });
    });
  });
});
