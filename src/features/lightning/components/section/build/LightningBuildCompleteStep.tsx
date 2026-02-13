"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

import { useFormContext } from "react-hook-form";

import { Spinner } from "@/shared";

import { LIGHTNING_BUILD_MESSAGE } from "../../../constants";
import { useCreateLightning } from "../../../hooks/actions";
import { useLightningBuildContext } from "../../../providers";
import type { LightningCreateFormData } from "../../../types/schemas";

const MESSAGE = LIGHTNING_BUILD_MESSAGE.COMPLETE;

/**
 * 번개 생성 제출 이후 — 회원가입 `CompleteStep`과 동일한 패턴(로딩 / 실패 / 성공).
 * 제출 직전 `idle`도 스피너로 취급합니다.
 */
export function LightningBuildCompleteStep() {
  const router = useRouter();
  const hasSubmittedRef = useRef(false);
  const form = useFormContext<LightningCreateFormData>();
  const { setBuildStep } = useLightningBuildContext();
  const {
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

  const error = useMemo(
    () =>
      mutationError instanceof Error
        ? mutationError
        : mutationError
          ? new Error(String(mutationError))
          : null,
    [mutationError]
  );

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
            <p className="mb-4 text-grey-600">
              {error?.message ?? MESSAGE.GENERIC_ERROR}
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

  if (isSuccess) {
    return (
      <div className="flex flex-1 flex-col px-6 py-4 overflow-y-auto">
        <div className="flex h-full grow flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <svg
                className="h-8 w-8 text-background"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-grey-800">
              {MESSAGE.SUCCESS_TITLE}
            </h2>
            <p className="mb-4 text-grey-600">{MESSAGE.SUCCESS_SUBTITLE}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              router.push("/lightning");
            }}
            className="rounded-lg bg-primary px-6 py-2 text-background transition-colors hover:bg-primary-light"
          >
            {MESSAGE.GO_TO_LIGHTNING}
          </button>
        </div>
      </div>
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
