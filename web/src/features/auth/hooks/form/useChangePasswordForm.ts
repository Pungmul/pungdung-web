"use client";

import { useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  type ChangePasswordFormData,
  createChangePasswordSchema,
} from "../../types/schemas";

type UseChangePasswordFormOptions = {
  requiresCurrentPassword: boolean;
};

export function useChangePasswordForm({
  requiresCurrentPassword,
}: UseChangePasswordFormOptions) {
  const schema = useMemo(
    () => createChangePasswordSchema(requiresCurrentPassword),
    [requiresCurrentPassword]
  );

  const {
    formState: { errors: inputErrors, isValid },
    ...form
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  return {
    ...form,
    inputErrors,
    isValid,
  };
}
