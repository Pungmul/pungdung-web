"use client";

import { useState } from "react";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { clubQueries } from "@/features/club";

import { authMutationOptions } from "../../queries";
import { transformKakaoSignUpData } from "../../services";
import { type IKakaoSignUpFormData } from "../../types/schemas";

type SubmitSignUpOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useKakaoSignUpActions() {
  const { data: clubList } = useSuspenseQuery(clubQueries.list());
  const [isLoading, setIsLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState<Error | null>(null);
  const {
    mutateAsync: submitSignUp,
    isPending,
    error: mutationError,
  } = useMutation(authMutationOptions.kakaoSignUp());

  const submitFinalSignUp = async (
    formData: IKakaoSignUpFormData,
    options?: SubmitSignUpOptions
  ) => {
    setIsLoading(true);
    setSubmissionError(null);
    try {
      const finalData = transformKakaoSignUpData(clubList, formData);
      await submitSignUp(finalData);
      options?.onSuccess?.();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      setSubmissionError(err);
      options?.onError?.(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitFinalSignUp,
    isPending: isPending || isLoading,
    error: submissionError ?? mutationError ?? null,
  };
}
