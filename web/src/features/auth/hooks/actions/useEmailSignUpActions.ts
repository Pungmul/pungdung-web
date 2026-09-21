"use client";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { clubQueries } from "@/features/club";

import { fetchEmailExists, requestSignUp } from "../../api/client";
import { AUTH_VALIDATION } from "../../constants";
import { transformSignUpData } from "../../services";
import type { IEmailSignUpFormData } from "../../types/schemas";

export function useEmailSignUpActions() {
  const { data: clubList } = useSuspenseQuery(clubQueries.list());

  return useMutation<void, Error, IEmailSignUpFormData>({
    mutationFn: async (formData) => {
      const { isRegistered } = await fetchEmailExists({
        email: formData.email,
      });
      if (isRegistered) {
        throw new Error(AUTH_VALIDATION.EMAIL.ALREADY_REGISTERED);
      }
      await requestSignUp(transformSignUpData(clubList, formData));
    },
  });
}
