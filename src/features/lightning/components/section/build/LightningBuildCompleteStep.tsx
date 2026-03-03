"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

import { useFormContext } from "react-hook-form";

import { BottomFixedButton, Spinner } from "@/shared";
import { useView } from "@/shared/lib/view/view-store-provider";

import { LIGHTNING_BUILD_MESSAGE } from "../../../constants";
import { useCreateLightning } from "../../../hooks/actions";
import { useLightningBuildContext } from "../../../providers";
import {
  buildCreatedLightningMeetingPreview,
  getLightningCreateErrorMessage,
} from "../../../services";
import type { LightningCreateFormData } from "../../../types/schemas";
import { LightningCard } from "../../ui";

const MESSAGE = LIGHTNING_BUILD_MESSAGE.COMPLETE;

/**
 * 번개 생성 제출 이후 — 회원가입 `CompleteStep`과 동일한 패턴(로딩 / 실패 / 성공).
 * 제출 직전 `idle`도 스피너로 취급합니다.
 */
export function LightningBuildCompleteStep() {
  const router = useRouter();
  const view = useView();
  const hasSubmittedRef = useRef(false);
  const form = useFormContext<LightningCreateFormData>();
  const { setBuildStep } = useLightningBuildContext();
  const {
    data: createResult,
    mutateAsync: createLightning,
    isSuccess,
    isError,
    error: mutationError,
    reset: resetCreateMutation,
  } = useCreateLightning();

  const submitLightningBuild = useCallback(async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      setBuildStep("Summary");
      return;
    }

    try {
      await createLightning(form.getValues());
    } catch {
      // react-query 실패는 isError·error로 표시
    }
  }, [createLightning, form, setBuildStep]);

  const handleBackFromComplete = useCallback(() => {
    resetCreateMutation();
    setBuildStep("Summary");
  }, [resetCreateMutation, setBuildStep]);

  const handleRetry = useCallback(() => {
    resetCreateMutation();
    void submitLightningBuild();
  }, [resetCreateMutation, submitLightningBuild]);

  /** 인터셉트 모달은 `push`로 부모 경로만 바꿔도 슬롯이 안 비는 경우가 있어, 헤더 닫기와 동일하게 `back` 처리 */
  const exitAfterSuccess = useCallback(() => {
    if (view === "webview") {
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({ action: "pop" })
      );
      return;
    }
    router.back();
  }, [router, view]);

  const errorMessage = useMemo(
    () => (mutationError ? getLightningCreateErrorMessage(mutationError) : null),
    [mutationError]
  );

  const createdPreview = useMemo(() => {
    if (!createResult) {
      return null;
    }
    return buildCreatedLightningMeetingPreview(form.getValues(), createResult);
  }, [createResult, form]);

  useEffect(() => {
    if (hasSubmittedRef.current) {
      return;
    }

    hasSubmittedRef.current = true;
    void submitLightningBuild();
  }, [submitLightningBuild]);

  if (isError) {
    return (
      <div className="flex flex-1 flex-col px-6 py-4 overflow-y-auto">
        <div className="flex h-full grow flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-grey-800">
              {MESSAGE.FAILURE_TITLE}
            </h2>
            <p className="mb-4 text-grey-600 whitespace-pre-wrap">
              {errorMessage ?? MESSAGE.GENERIC_ERROR}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBackFromComplete}
              className="rounded-lg border border-grey-300 px-6 py-2 text-grey-700 transition-colors hover:bg-grey-100"
            >
              {MESSAGE.BACK_TO_EDIT}
            </button>
            <button
              type="button"
              onClick={handleRetry}
              className="rounded-lg bg-grey-800 px-6 py-2 text-background transition-colors hover:bg-grey-700"
            >
              {MESSAGE.RETRY}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess && createdPreview) {
    return (
      <>
        <div className="flex flex-1 flex-col px-6 py-4 overflow-y-auto">
          <div className="flex flex-1 flex-col items-stretch gap-6 justify-center">
            <h2 className="text-center text-2xl font-bold text-grey-800">
              {MESSAGE.SUCCESS_PAGE_TITLE}
            </h2>
            <div className="mx-auto w-full max-w-md">
              <LightningCard {...createdPreview} hideJoinButton />
            </div>
          </div>
        </div>
        <BottomFixedButton
          onClick={() => {
            exitAfterSuccess();
          }}
        >
          {MESSAGE.SUCCESS_CONFIRM}
        </BottomFixedButton>
      </>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-6 py-4 overflow-y-auto">
      <div className="flex h-full grow flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <Spinner size={64} />
          <h2 className="text-2xl font-bold text-grey-800">
            {MESSAGE.PENDING_TITLE}
          </h2>
        </div>
      </div>
    </div>
  );
}
