"use client";

import type { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";

import { BottomFixedButton, Input, Space, Spinner } from "@/shared";

import { AUTH_UI_MESSAGE } from "../../constants";
import type { EmailCheckFormData } from "../../types/schemas";

export interface EmailCheckFormProps {
  register: UseFormRegister<EmailCheckFormData>;
  handleSubmit: UseFormHandleSubmit<EmailCheckFormData>;
  emailRegisterOptions: Parameters<UseFormRegister<EmailCheckFormData>>[1];
  isCheckingEmail: boolean;
  inputErrors: FieldErrors<EmailCheckFormData>;
  isValid: boolean;
  isPending: boolean;
  onSubmit: (data: EmailCheckFormData) => void;
}

export function EmailCheckForm({
  register,
  handleSubmit,
  emailRegisterOptions,
  isCheckingEmail,
  inputErrors,
  isValid,
  isPending,
  onSubmit,
}: EmailCheckFormProps) {
  return (
    <section className="flex flex-col flex-grow">
      <Space h={24} />
      <div className="px-6">
        <p className="lg:text-[15px] text-[13px] font-normal text-grey-500 bg-grey-100 px-[16px] py-[12px] rounded-[5px] whitespace-pre-line">
          {AUTH_UI_MESSAGE.RESET_PASSWORD.INSTRUCTION}
        </p>
      </div>
      <Space h={24} />
      <form
        className="flex flex-col gap-[16px] flex-grow"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex-grow px-6">
          <Input
            label={AUTH_UI_MESSAGE.EMAIL_CHECK.LABEL}
            placeholder={AUTH_UI_MESSAGE.EMAIL_CHECK.PLACEHOLDER}
            className="w-full"
            errorMessage={inputErrors.email?.message || ""}
            {...register("email", emailRegisterOptions)}
          />
        </div>
        <BottomFixedButton
          disabled={isCheckingEmail || isPending || !isValid}
          type="submit"
          className="bg-primary disabled:bg-primary-light text-background mx-auto max-w-[768px]"
        >
          {isCheckingEmail || isPending ? <Spinner /> : AUTH_UI_MESSAGE.EMAIL_CHECK.SUBMIT}
        </BottomFixedButton>
      </form>
    </section>
  );
}
