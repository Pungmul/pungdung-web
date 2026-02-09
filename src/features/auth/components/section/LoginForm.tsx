"use client";

import { Button, HookFormReturn, Input, Spinner } from "@/shared";

import { AUTH_DOMAIN_MESSAGE, AUTH_UI_MESSAGE } from "../../constants";

export interface LoginFormProps
  extends HookFormReturn<{
    loginId: string;
    password: string;
  }> {
  onSubmit: ({
    loginId,
    password,
  }: {
    loginId: string;
    password: string;
  }) => void;
  isPending: boolean;
  requestError: Error | null;
}

export function LoginForm({
  register,
  inputErrors,
  handleSubmit,
  onSubmit,
  isPending,
  requestError,
}: LoginFormProps) {
  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="ID"
        errorMessage={inputErrors.loginId?.message || ""}
        {...register("loginId")}
      />
      <Input
        label={AUTH_UI_MESSAGE.LOGIN.PASSWORD_LABEL}
        errorMessage={inputErrors.password?.message || ""}
        isEncrypted={true}
        {...register("password")}
      />

      {requestError && (
        <p className="w-full text-red-400 px-[12px]">
          {requestError.message || AUTH_DOMAIN_MESSAGE.LOGIN.GENERIC_FAILURE}
        </p>
      )}

      <Button
        className="bg-primary text-background"
        type="submit"
        disabled={isPending}
      >
        {isPending ? <Spinner /> : AUTH_UI_MESSAGE.LOGIN.SUBMIT}
      </Button>
    </form>
  );
}
