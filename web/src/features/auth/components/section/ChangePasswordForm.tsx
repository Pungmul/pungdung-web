"use client";

import { HookFormReturn } from "@/shared";
import { BottomFixedButton,Input, Spinner } from "@/shared/components";

import { AUTH_DOMAIN_MESSAGE, AUTH_UI_MESSAGE } from "../../constants";
import type { ChangePasswordFormData } from "../../types/schemas";

interface ChangePasswordFormProps extends HookFormReturn<ChangePasswordFormData> {
  onSubmit: ({
    currentPassword,
    newPassword,
    confirmPassword,
  }: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
  isPending: boolean;
  requestError: Error | null;
}

export function ChangePasswordForm({
  onSubmit,
  isPending,
  requestError,
  ...form
}: ChangePasswordFormProps) {
  return (
    <form
      className="flex w-full flex-col h-full"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4 flex-grow px-[12px]">
        <Input
          label={AUTH_UI_MESSAGE.CHANGE_PASSWORD.FORM.CURRENT_LABEL}
          type="password"
          {...form.register("currentPassword")}
          errorMessage={form.inputErrors.currentPassword?.message || ""}
        />
        <Input
          label={AUTH_UI_MESSAGE.CHANGE_PASSWORD.FORM.NEW_LABEL}
          type="password"
          {...form.register("newPassword")}
          placeholder={AUTH_UI_MESSAGE.CHANGE_PASSWORD.FORM.NEW_PLACEHOLDER}
          errorMessage={form.inputErrors.newPassword?.message || ""}
        />
        <Input
          label={AUTH_UI_MESSAGE.CHANGE_PASSWORD.FORM.CONFIRM_LABEL}
          type="password"
          {...form.register("confirmPassword")}
          placeholder={AUTH_UI_MESSAGE.CHANGE_PASSWORD.FORM.CONFIRM_PLACEHOLDER}
          errorMessage={form.inputErrors.confirmPassword?.message || ""}
        />
      </div>

      {requestError && (
        <p className="w-full text-red-400 px-[12px]">
          {AUTH_DOMAIN_MESSAGE.CHANGE_PASSWORD.FAILURE_PREFIX}
          {requestError.message}
        </p>
      )}

      <BottomFixedButton
        className="bg-primary text-background"
        type="submit"
        disabled={isPending || !form.isValid}
      >
        {isPending ? <Spinner /> : AUTH_UI_MESSAGE.CHANGE_PASSWORD.FORM.SUBMIT}
      </BottomFixedButton>
    </form>
  );
}
