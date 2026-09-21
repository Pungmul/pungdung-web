"use client";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { clubQueries } from "@/features/club";

import { requestKakaoSignUp } from "../../api/client";
import { transformKakaoSignUpData } from "../../services";
import type { IKakaoSignUpFormData } from "../../types/schemas";

export function useKakaoSignUpActions() {
  const { data: clubList } = useSuspenseQuery(clubQueries.list());

  return useMutation<void, Error, IKakaoSignUpFormData>({
    mutationFn: async (formData) => {
      await requestKakaoSignUp(transformKakaoSignUpData(clubList, formData));
    },
  });
}
