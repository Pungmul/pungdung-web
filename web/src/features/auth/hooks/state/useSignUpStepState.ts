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

export function useSignUpStepCursor<TStep extends string>({
  stepOrder,
  initialStep,
}: CreateSignUpStepStateParams<TStep>) {
  const [currentStep, setCurrentStep] = useState<TStep>(initialStep);

  const onNextStep = useCallback(() => {
    setCurrentStep((step) => getNextStepInOrder(stepOrder, step) ?? step);
  }, [stepOrder]);

  const onPrevStep = useCallback(() => {
    setCurrentStep((step) => getPreviousStepInOrder(stepOrder, step) ?? step);
  }, [stepOrder]);

  return {
    currentStep,
    onNextStep,
    onPrevStep,
  };
}

export function useSignUpStepState<TStep extends string, TData extends object>({
  stepOrder,
  initialStep,
  initialData,
}: CreateSignUpStateParams<TStep, TData>) {
  const step = useSignUpStepCursor({ stepOrder, initialStep });
  const [data, setData] = useState<TData>(initialData);

  const onSubmit = useCallback((patch: Partial<TData>) => {
    const next = {
      ...data,
      ...patch,
    };
    setData(next);
    return next;
  }, [data]);

  return {
    ...step,
    data,
    onSubmit,
  };
}
