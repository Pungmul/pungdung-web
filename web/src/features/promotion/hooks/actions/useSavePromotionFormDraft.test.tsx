import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as Core from "@/core";
import { Toast } from "@/shared";

import * as PromotionApi from "../../api/client";
import type { PromotionFormSavePayload } from "../../types";

import { useSavePromotionFormDraft } from "./useSavePromotionFormDraft";

const minimalForm = (): PromotionFormSavePayload => ({
  expectedVersion: 0,
  snapshot: {
    title: "t",
    description: "",
    questions: [],
    formType: "PERFORMANCE",
    startAt: null,
    limitNum: null,
    address: null,
    performanceImageIdList: null,
  },
});

describe("useSavePromotionFormDraft", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.spyOn(Core, "getQueryClient").mockReturnValue(queryClient);
    vi.spyOn(PromotionApi, "savePromotionForm").mockResolvedValue({
      formId: 3,
      version: 2,
      autosavedAt: "2025-01-01T00:00:00Z",
    });
    vi.spyOn(Toast, "show").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("formId가 없으면 저장 API를 호출하지 않는다", async () => {
    const { result } = renderHook(() => useSavePromotionFormDraft(), {
      wrapper,
    });

    await act(async () => {
      await result.current.handleSaveDraft({
        formId: null,
        form: minimalForm(),
      });
    });

    expect(PromotionApi.savePromotionForm).not.toHaveBeenCalled();
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it("성공 시 무효화·성공 토스트", async () => {
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useSavePromotionFormDraft(), {
      wrapper,
    });

    await act(async () => {
      await result.current.handleSaveDraft({
        formId: 3,
        form: minimalForm(),
      });
    });

    await waitFor(() => {
      expect(PromotionApi.savePromotionForm).toHaveBeenCalledWith(
        3,
        expect.objectContaining({ expectedVersion: 0 })
      );
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["promotion", "formDraft", "3"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["myPromotionFormList"],
    });
    expect(Toast.show).toHaveBeenCalledWith({
      message: "임시 저장 완료",
      type: "success",
      duration: 3000,
    });
  });

  it("실패 시 에러 토스트와 onError", async () => {
    vi.spyOn(PromotionApi, "savePromotionForm").mockRejectedValueOnce(
      new Error("network")
    );
    const onError = vi.fn();

    const { result } = renderHook(() => useSavePromotionFormDraft(), {
      wrapper,
    });

    await act(async () => {
      await result.current.handleSaveDraft({
        formId: 5,
        form: minimalForm(),
        onError,
      });
    });

    expect(Toast.show).toHaveBeenCalledWith({
      message: "임시 저장 실패",
      type: "error",
      duration: 3000,
    });
    expect(onError).toHaveBeenCalled();
  });

  it("showToast false면 토스트를 띄우지 않는다", async () => {
    const { result } = renderHook(() => useSavePromotionFormDraft(), {
      wrapper,
    });

    await act(async () => {
      await result.current.handleSaveDraft({
        formId: 7,
        form: minimalForm(),
        showToast: false,
      });
    });

    expect(Toast.show).not.toHaveBeenCalled();
  });
});
