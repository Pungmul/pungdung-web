"use client";

import { useState } from "react";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { clubQueries } from "@/features/club";

import { fetchEmailExists } from "../../api/client";
import { AUTH_VALIDATION } from "../../constants";
import { authMutationOptions } from "../../queries";
import { transformSignUpData } from "../../services";
import { IEmailSignUpFormData } from "../../types/schemas";

type SubmitSignUpOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useEmailSignUpActions() {
  const { data: clubList } = useSuspenseQuery(clubQueries.list());
  const [isLoading, setIsLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState<Error | null>(null);
  const {
    mutateAsync: submitSignUp,
    isPending,
    error: mutationError,
  } = useMutation(authMutationOptions.signUp());

  const submitFinalSignUp = async (
    formData: IEmailSignUpFormData,
    options?: SubmitSignUpOptions
  ) => {
    setIsLoading(true);
    setSubmissionError(null);
    try {
      const { isRegistered } = await fetchEmailExists({
        email: formData.email,
      });
      if (isRegistered) {
        throw new Error(AUTH_VALIDATION.EMAIL.ALREADY_REGISTERED);
      }
      const finalData = transformSignUpData(clubList, formData);
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
