"use client";

import { useCallback, useState } from "react";

import { getNextStepInOrder, getPreviousStepInOrder } from "../../services";

type CreateSignUpStepStateParams<TStep extends string> = {
  stepOrder: readonly TStep[];
  initialStep: TStep;
};

type CreateSignUpStateParams<
  TStep extends string,
  TData extends object
> = CreateSignUpStepStateParams<TStep> & {
  initialData: TData;
};

export function useSignUpStepState<TStep extends string, TData extends object>({
  stepOrder,
  initialStep,
  initialData,
}: CreateSignUpStateParams<TStep, TData>) {
  const [currentStep, setCurrentStep] = useState<TStep>(initialStep);
  const [data, setData] = useState<TData>(initialData);

  const onNextStep = useCallback(() => {
    setCurrentStep((step) => {
      const next = getNextStepInOrder(stepOrder, step);
      return next ?? step;
    });
  }, [stepOrder]);

  const onPrevStep = useCallback(() => {
    setCurrentStep((step) => {
      const prev = getPreviousStepInOrder(stepOrder, step);
      return prev ?? step;
    });
  }, [stepOrder]);

  const onSubmit = useCallback((patch: Partial<TData>) => {
    setData((prev) => ({
      ...prev,
      ...patch,
    }));
  }, []);

  return {
    currentStep,
    data,
    onSubmit,
    onNextStep,
    onPrevStep,
  };
}
