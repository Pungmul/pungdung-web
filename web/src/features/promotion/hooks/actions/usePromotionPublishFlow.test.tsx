import type { FormEvent, PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as Core from "@/core";
import { ClientApiError } from "@/core/api/client";
import { Alert, Toast } from "@/shared";

import * as PromotionApi from "../../api/client";
import { UNKNOWN_PROMOTION_ACTION_MESSAGE } from "../../constants/promotion-action-error-copy";
import type { PromotionPublishValidation } from "../../services";
import type { PromotionFormSavePayload } from "../../types";

import { usePromotionPublishFlow } from "./usePromotionPublishFlow";

const replace = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent;

describe("usePromotionPublishFlow", () => {
  let queryClient: QueryClient;
  let baseVersionRef: { current: number };

  const buildPayload = (): PromotionFormSavePayload => ({
    expectedVersion: baseVersionRef.current,
    snapshot: {
      title: "t",
      description: "d",
      questions: [],
      formType: "PERFORMANCE",
      closeAt: null,
      startAt: null,
      limitNum: null,
      address: null,
      performanceImageIdList: null,
    },
  });

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    baseVersionRef = { current: 1 };
    vi.spyOn(Core, "getQueryClient").mockReturnValue(queryClient);
    vi.spyOn(Toast, "show").mockImplementation(() => {});
    vi.spyOn(PromotionApi, "savePromotionForm").mockImplementation(
      async (formId, form) => ({
        formId,
        version: form.expectedVersion + 1,
        autosavedAt: "2025-01-01T00:00:00Z",
      })
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const renderFlow = ({
    formId = "9",
    validate = () => ({ ok: true }),
    hasPoster = () => true,
    onBeforeLeave,
    onVersionConflict,
  }: {
    formId?: string;
    validate?: () => PromotionPublishValidation;
    hasPoster?: () => boolean;
    onBeforeLeave?: () => void;
    onVersionConflict?: () => Promise<void> | void;
  } = {}) =>
    renderHook(
      () =>
        usePromotionPublishFlow({
          formId,
          validate,
          hasPoster,
          buildPayload,
          onSaved: (version) => {
            baseVersionRef.current = version;
          },
          ...(onBeforeLeave ? { onBeforeLeave } : {}),
          ...(onVersionConflict ? { onVersionConflict } : {}),
        }),
      { wrapper }
    );

  it("formId가 정수가 아니면 요청 없이 에러를 던진다", async () => {
    const { result } = renderFlow({ formId: "abc" });

    await expect(result.current.handlePublish(submitEvent())).rejects.toThrow(
      "프로모션 formId가 올바르지 않음"
    );
    expect(PromotionApi.savePromotionForm).not.toHaveBeenCalled();
  });

  it("검증에 실패하면 저장하지 않고 사유를 보여준다", async () => {
    const { result } = renderFlow({
      validate: () => ({
        ok: false,
        field: "questions",
        message: "질문을 1개 이상 추가해주세요.",
      }),
    });

    await act(() => result.current.handlePublish(submitEvent()));

    expect(PromotionApi.savePromotionForm).not.toHaveBeenCalled();
    expect(result.current.isPublishing).toBe(false);
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ message: "질문을 1개 이상 추가해주세요.", type: "error" })
    );
  });

  it("게시가 실패해도 저장 버전을 반영해 재시도 때 새 버전으로 저장한다", async () => {
    vi.spyOn(PromotionApi, "publishPromotionForm")
      .mockRejectedValueOnce(
        new ClientApiError({ status: 400, code: "FORM_INVALID", message: "질문이 없습니다." })
      )
      .mockResolvedValueOnce({ formId: 9, publicKey: "pk", publicUrl: "/x" } as never);
    const onBeforeLeave = vi.fn();
    const { result } = renderFlow({ onBeforeLeave });

    await act(() => result.current.handlePublish(submitEvent()));

    expect(onBeforeLeave).not.toHaveBeenCalled();
    expect(PromotionApi.publishPromotionForm).toHaveBeenLastCalledWith(9, 2);
    expect(baseVersionRef.current).toBe(2);
    expect(result.current.isPublishing).toBe(false);
    expect(Toast.show).toHaveBeenLastCalledWith(
      expect.objectContaining({
        message: UNKNOWN_PROMOTION_ACTION_MESSAGE,
        type: "error",
      })
    );

    await act(() => result.current.handlePublish(submitEvent()));

    expect(PromotionApi.savePromotionForm).toHaveBeenLastCalledWith(
      9,
      expect.objectContaining({ expectedVersion: 2 })
    );
    expect(PromotionApi.publishPromotionForm).toHaveBeenLastCalledWith(9, 3);
    expect(onBeforeLeave).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith("/board/promote/d/pk");
    expect(result.current.isPublishing).toBe(true);
  });

  it("저장이 실패하면 게시를 호출하지 않고 버전을 유지한다", async () => {
    vi.spyOn(PromotionApi, "savePromotionForm").mockRejectedValueOnce(
      new Error("network")
    );
    vi.spyOn(PromotionApi, "publishPromotionForm");
    const { result } = renderFlow();

    await act(() => result.current.handlePublish(submitEvent()));

    expect(PromotionApi.publishPromotionForm).not.toHaveBeenCalled();
    expect(baseVersionRef.current).toBe(1);
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        message: UNKNOWN_PROMOTION_ACTION_MESSAGE,
        type: "error",
      })
    );
  });

  it("게시 버전 충돌이면 최신 초안을 다시 불러온다", async () => {
    vi.spyOn(PromotionApi, "publishPromotionForm").mockRejectedValueOnce(
      new ClientApiError({
        status: 400,
        code: "POST_010",
        message: "폼 업데이트 버전 충돌입니다.",
        payload: JSON.stringify({
          code: "POST_010",
          message: "폼 업데이트 버전 충돌입니다.",
          response: null,
          isSuccess: false,
        }),
      })
    );
    let releaseConflict: () => void = () => {};
    const onVersionConflict = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          releaseConflict = resolve;
        })
    );
    const { result } = renderFlow({ onVersionConflict });

    let finished: Promise<unknown> = Promise.resolve();
    await act(async () => {
      finished = result.current.handlePublish(submitEvent());
      await vi.waitUntil(() => onVersionConflict.mock.calls.length > 0);
    });

    expect(result.current.isPublishing).toBe(true);

    await act(async () => {
      releaseConflict();
      await finished;
    });

    expect(onVersionConflict).toHaveBeenCalledTimes(1);
    expect(Toast.show).toHaveBeenLastCalledWith(
      expect.objectContaining({
        message: "다른 곳에서 먼저 수정되어 게시하지 못했어요.",
        type: "error",
      })
    );
    expect(result.current.isPublishing).toBe(false);
  });

  it("포스터가 없으면 확인 후에만 저장하고 게시한다", async () => {
    const confirmSpy = vi.spyOn(Alert, "confirm").mockImplementation(() => {});
    vi.spyOn(PromotionApi, "publishPromotionForm").mockResolvedValue({
      formId: 9,
      publicKey: "pk",
      publicUrl: "/x",
    } as never);
    const { result } = renderFlow({ hasPoster: () => false });

    await act(() => result.current.handlePublish(submitEvent()));

    expect(PromotionApi.savePromotionForm).not.toHaveBeenCalled();
    expect(result.current.isPublishing).toBe(false);

    await act(async () => {
      confirmSpy.mock.calls[0]![0].onConfirm?.();
    });

    await waitFor(() => {
      expect(PromotionApi.publishPromotionForm).toHaveBeenCalledWith(9, 2);
    });
  });
});
