"use client";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { authMutationOptions } from "../../queries";
import {
  type ChangePasswordFormData,
  changePasswordSchema,
} from "../../types/schemas";

export function useChangePasswordForm() {
  const router = useRouter();
  const {
    formState: { errors: inputErrors, isValid },
    ...form
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    mutate: changePassword,
    isPending,
    error: requestError,
  } = useMutation(authMutationOptions.changePassword());

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword(data, {
      onSuccess: () => {
        alert("비밀번호가 변경되었습니다.");
        router.replace("/my-page");
      },
      onError: (error) => {
        console.error(error);
        alert("비밀번호 변경에 실패했습니다.");
      },
    });
  };

  return {
    ...form,
    inputErrors,
    isValid,
    onSubmit,
    isPending,
    requestError,
  };
}
