"use client";

import type { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";

import { BottomFixedButton, Button, Input, Spinner } from "@/shared";

import { AUTH_DOMAIN_MESSAGE, AUTH_UI_MESSAGE } from "../../constants";
import { usePasswordVisibility } from "../../hooks/form";
import type { ResetPasswordFormData } from "../../types/schemas";

export interface ResetPasswordFormProps {
  invalidToken: boolean;
  register: UseFormRegister<ResetPasswordFormData>;
  handleSubmit: UseFormHandleSubmit<ResetPasswordFormData>;
  inputErrors: FieldErrors<ResetPasswordFormData>;
  isPending: boolean;
  onSubmit: (data: ResetPasswordFormData) => void;
  onNavigateToLogin: () => void;
}

export function ResetPasswordForm({
  invalidToken,
  register,
  handleSubmit,
  inputErrors,
  isPending,
  onSubmit,
  onNavigateToLogin,
}: ResetPasswordFormProps) {
  const newPassword = usePasswordVisibility();
  const confirmPassword = usePasswordVisibility();

  if (invalidToken) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-app gap-[24px]">
        <h1 className="text-2xl">
          {AUTH_DOMAIN_MESSAGE.RESET_PASSWORD.TOKEN_INVALID}
        </h1>
        <Button
          className="bg-primary text-background"
          onClick={onNavigateToLogin}
        >
          {AUTH_UI_MESSAGE.GO_TO_LOGIN_PAGE}
        </Button>
      </div>
    );
  }

  return (
    <section>
      <div className="w-full max-w-[640px] mx-auto px-[24px]">
        <h1 className="text-2xl font-bold">
          {AUTH_UI_MESSAGE.RESET_PASSWORD.TITLE}
        </h1>
      </div>
      <div className="w-full max-w-[640px] mx-auto px-[24px]">
        <form
          className="flex flex-col gap-[16px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label={AUTH_UI_MESSAGE.RESET_PASSWORD.FORM.NEW_PASSWORD_LABEL}
            placeholder={AUTH_UI_MESSAGE.RESET_PASSWORD.FORM.NEW_PASSWORD_PLACEHOLDER}
            className="w-full"
            type={newPassword.type}
            trailingComponent={newPassword.trailingComponent}
            errorMessage={inputErrors.password?.message || ""}
            {...register("password")}
          />
          <Input
            label={AUTH_UI_MESSAGE.RESET_PASSWORD.FORM.CONFIRM_LABEL}
            placeholder={AUTH_UI_MESSAGE.RESET_PASSWORD.FORM.CONFIRM_PLACEHOLDER}
            className="w-full"
            type={confirmPassword.type}
            trailingComponent={confirmPassword.trailingComponent}
            errorMessage={inputErrors.confirmPassword?.message || ""}
            {...register("confirmPassword")}
          />
          <BottomFixedButton
            disabled={isPending}
            type="submit"
            className="bg-primary text-background"
          >
            {isPending ? <Spinner /> : AUTH_UI_MESSAGE.RESET_PASSWORD.FORM.SUBMIT}
          </BottomFixedButton>
        </form>
      </div>
    </section>
  );
}
