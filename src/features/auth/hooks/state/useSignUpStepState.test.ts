import { act,renderHook } from "@testing-library/react";
import { describe, expect,it } from "vitest";

import { useSignUpStepState } from "./useSignUpStepState";

const STEP_ORDER = ["stepA", "stepB", "stepC"] as const;
type TestStep = (typeof STEP_ORDER)[number];
type TestData = { count: number; label: string };

describe("useSignUpStepState", () => {
  it("moves forward and backward within stepOrder", () => {
    const { result } = renderHook(() =>
      useSignUpStepState<TestStep, TestData>({
        stepOrder: STEP_ORDER,
        initialStep: "stepA",
        initialData: { count: 0, label: "x" },
      })
    );

    expect(result.current.currentStep).toBe("stepA");

    act(() => {
      result.current.onNextStep();
    });
    expect(result.current.currentStep).toBe("stepB");

    act(() => {
      result.current.onNextStep();
    });
    expect(result.current.currentStep).toBe("stepC");

    act(() => {
      result.current.onPrevStep();
    });
    expect(result.current.currentStep).toBe("stepB");
  });

  it("does not advance past last step", () => {
    const { result } = renderHook(() =>
      useSignUpStepState<TestStep, TestData>({
        stepOrder: STEP_ORDER,
        initialStep: "stepA",
        initialData: { count: 0, label: "x" },
      })
    );

    act(() => {
      result.current.onNextStep();
      result.current.onNextStep();
      result.current.onNextStep();
    });
    expect(result.current.currentStep).toBe("stepC");

    act(() => {
      result.current.onNextStep();
    });
    expect(result.current.currentStep).toBe("stepC");
  });

  it("merges partial data with onSubmit", () => {
    const { result } = renderHook(() =>
      useSignUpStepState<TestStep, TestData>({
        stepOrder: STEP_ORDER,
        initialStep: "stepA",
        initialData: { count: 0, label: "x" },
      })
    );

    act(() => {
      result.current.onSubmit({ count: 3 });
    });
    expect(result.current.data).toEqual({ count: 3, label: "x" });

    act(() => {
      result.current.onSubmit({ label: "y" });
    });
    expect(result.current.data).toEqual({ count: 3, label: "y" });
  });
});
