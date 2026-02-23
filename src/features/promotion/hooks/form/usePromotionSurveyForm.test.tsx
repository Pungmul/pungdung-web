import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Toast } from "@/shared";

import type { PromotionPublishedQuestion } from "../../types";

import { usePromotionSurveyForm } from "./usePromotionSurveyForm";

function textQuestion(
  id: number,
  required: boolean
): PromotionPublishedQuestion {
  return {
    id,
    questionType: "TEXT",
    label: "Q",
    required,
    orderNo: 1,
    settingsJson: "{}",
    options: [],
  };
}

function invalidChoiceQuestion(): PromotionPublishedQuestion {
  return {
    id: 99,
    questionType: "CHOICE",
    label: "선택",
    required: false,
    orderNo: 1,
    settingsJson: "{}",
    options: [],
  };
}

describe("usePromotionSurveyForm", () => {
  beforeEach(() => {
    vi.spyOn(Toast, "show").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("정규화 실패 시 isInvalid가 true", () => {
    const questions = [invalidChoiceQuestion()];
    const { result } = renderHook(() =>
      usePromotionSurveyForm({
        questions,
        onSubmit: vi.fn(),
      })
    );

    expect(result.current.isInvalid).toBe(true);
  });

  it("필수 TEXT 미입력이면 canContinue가 false", async () => {
    const questions = [textQuestion(1, true)];
    const { result } = renderHook(() =>
      usePromotionSurveyForm({
        questions,
        onSubmit: vi.fn(),
      })
    );

    await waitFor(() => {
      expect(result.current.submit.canContinue).toBe(false);
    });
    expect(result.current.submit.requiredCount).toBe(1);
    expect(result.current.submit.requiredDisplayNumbers).toEqual([1]);
  });

  it("선택 TEXT만 있으면 제출 시 onSubmit·성공 토스트", async () => {
    const onSubmit = vi.fn();
    const questions = [textQuestion(10, false)];
    const { result } = renderHook(() =>
      usePromotionSurveyForm({
        questions,
        onSubmit,
      })
    );

    await waitFor(() => {
      expect(result.current.submit.canContinue).toBe(true);
    });

    await act(async () => {
      await result.current.submit.onSubmit();
    });

    expect(onSubmit).toHaveBeenCalled();
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "설문이 성공적으로 제출되었습니다!",
        type: "success",
      })
    );
  });

  it("onSubmit이 던지면 에러 토스트", async () => {
    const questions = [textQuestion(2, false)];
    const { result } = renderHook(() =>
      usePromotionSurveyForm({
        questions,
        onSubmit: () => {
          throw new Error("submit fail");
        },
      })
    );

    await waitFor(() => {
      expect(result.current.submit.canContinue).toBe(true);
    });

    await act(async () => {
      await result.current.submit.onSubmit();
    });

    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "설문 제출 중 오류가 발생했습니다.",
        type: "error",
      })
    );
  });
});
