"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authMutationOptions, authQueries } from "../../queries";
import type { ChangePasswordFormData } from "../../types/schemas";

export function useChangePasswordAction() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    mutate: changePassword,
    isPending,
    error: requestError,
  } = useMutation(authMutationOptions.changePassword());

  const onSubmit = ({
    currentPassword,
    newPassword,
  }: ChangePasswordFormData) => {
    changePassword(
      { currentPassword, newPassword },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(authQueries.passwordInfo());
          alert("비밀번호가 변경되었습니다.");
          router.replace("/my-page");
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  };

  return {
    onSubmit,
    isPending,
    requestError,
  };
}
