"use client";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { authMutationOptions } from "../../queries";
import {
  type ResetPasswordFormData,
  resetPasswordSchema,
} from "../../types/schemas";

export function useResetPasswordForm(temporaryToken: string) {
  const router = useRouter();
  const invalidToken = !temporaryToken;

  const {
    register,
    handleSubmit,
    formState: { errors: inputErrors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: resetPassword, isPending } = useMutation(
    authMutationOptions.resetPassword()
  );

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!temporaryToken) {
      return;
    }

    resetPassword(
      {
        password: data.password,
        token: temporaryToken,
      },
      {
        onSuccess: () => {
          router.push("/login");
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  };

  const onNavigateToLogin = () => {
    router.push("/login");
  };

  return {
    invalidToken,
    register,
    handleSubmit,
    inputErrors,
    isPending,
    onSubmit,
    onNavigateToLogin,
  };
}
