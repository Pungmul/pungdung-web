import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Alert, Toast } from "@/shared/store";

import * as PromotionApi from "../../api/client";
import { useDeletePromotionFormAction } from "./useDeletePromotionFormAction";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

describe("useDeletePromotionFormAction", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.spyOn(PromotionApi, "deletePromotionForm").mockResolvedValue(undefined);
    vi.spyOn(Toast, "show").mockImplementation(() => {});
    vi.spyOn(Alert, "alert").mockImplementation(() => {});
    vi.spyOn(Alert, "confirm").mockImplementation((data) => {
      data.onConfirm?.();
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("confirm 취소 시 삭제 API를 호출하지 않는다", async () => {
    vi.mocked(Alert.confirm).mockImplementation(() => {});

    const { result } = renderHook(() => useDeletePromotionFormAction(), {
      wrapper,
    });

    act(() => {
      result.current.requestDeleteForm({
        formId: 4,
        confirmTitle: "공연 삭제",
        confirmMessage: "삭제할까요?",
      });
    });

    expect(PromotionApi.deletePromotionForm).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });

  it("성공 시 목록을 먼저 무효화하고 replace한 뒤 상세를 무효화한다", async () => {
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeletePromotionFormAction(), {
      wrapper,
    });

    act(() => {
      result.current.requestDeleteForm({
        formId: 4,
        publicKey: "pk-4",
        confirmTitle: "공연 삭제",
        confirmMessage: "삭제할까요?",
      });
    });

    await waitFor(() => {
      expect(PromotionApi.deletePromotionForm).toHaveBeenCalledWith(4);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["myPromotionFormList"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["promotionList"],
    });
    expect(replace).toHaveBeenCalledWith(
      "/board/promote/l?tab=my-promotion-form-list"
    );

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["promotionDetail", "pk-4"],
      });
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["promotion", "formDraft", "4"],
    });
  });
});
