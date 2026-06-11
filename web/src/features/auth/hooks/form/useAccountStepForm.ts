"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import {
  RegisterOptions,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";

import { AUTH_VALIDATION, SIGN_UP_FORM_FIELD } from "../../constants";
import { authQueries } from "../../queries";
import { AccountFormData,accountSchema } from "../../types/schemas";

const ACCOUNT_FIELDS = SIGN_UP_FORM_FIELD.ACCOUNT;

export function useAccountStepForm() {
  const {
    register: baseRegister,
    control,
    trigger,
    clearErrors,
    setError,
    getValues,
  } = useFormContext<AccountFormData>();
  const { errors: inputErrors } = useFormState({
    control,
    name: [
      ACCOUNT_FIELDS.EMAIL,
      ACCOUNT_FIELDS.PASSWORD,
      ACCOUNT_FIELDS.CONFIRM_PASSWORD,
    ],
  });

  const accountValues = useWatch({
    control,
    name: [
      ACCOUNT_FIELDS.EMAIL,
      ACCOUNT_FIELDS.PASSWORD,
      ACCOUNT_FIELDS.CONFIRM_PASSWORD,
    ],
  });
  const [email, password, confirmPassword] = accountValues;

  const { refetch: refetchEmailExists, isFetching: isCheckingEmail } = useQuery(
    authQueries.emailExists(email)
  );

  const emailRegisterOptions: RegisterOptions<AccountFormData, "email"> = {
    onBlur: async () => {
      const isEmailValid = await trigger(ACCOUNT_FIELDS.EMAIL);
      if (!isEmailValid) {
        return;
      }

      try {
        const { data } = await refetchEmailExists();
        if (data?.isRegistered) {
          setError(ACCOUNT_FIELDS.EMAIL, {
            type: "validate",
            message: AUTH_VALIDATION.EMAIL.ALREADY_REGISTERED,
          });
          return;
        }

        if (
          inputErrors.email?.message ===
          AUTH_VALIDATION.EMAIL.ALREADY_REGISTERED
        ) {
          clearErrors(ACCOUNT_FIELDS.EMAIL);
        }
      } catch {
        setError(ACCOUNT_FIELDS.EMAIL, {
          type: "validate",
          message: AUTH_VALIDATION.UNKNOWN_ERROR,
        });
      }
    },
  };

  const passwordRegisterOptions: RegisterOptions<AccountFormData, "password"> =
    {
      onBlur: async () => {
        await trigger(ACCOUNT_FIELDS.PASSWORD);
        if (confirmPassword) {
          await trigger(ACCOUNT_FIELDS.CONFIRM_PASSWORD);
        }
      },
    };

  /**
   * 스키마 단위로 형식·refine(비밀번호 일치)을 함께 검증한다.
   * 이메일 중복 여부는 onBlur 비동기로 `setError`되므로 `inputErrors.email`로 별도 확인.
   */
  const isAccountFormValid = useMemo(() => {
    return accountSchema.safeParse({
      email,
      password,
      confirmPassword,
    }).success;
  }, [email, password, confirmPassword]);

  const canSubmit =
    isAccountFormValid && !inputErrors.email && !isCheckingEmail;

  const submitAccountStep = async (
    onValid: (data: AccountFormData) => void
  ) => {
    const isValidByResolver = await trigger([
      ACCOUNT_FIELDS.EMAIL,
      ACCOUNT_FIELDS.PASSWORD,
      ACCOUNT_FIELDS.CONFIRM_PASSWORD,
    ]);

    if (!isValidByResolver) {
      return;
    }

    onValid(getValues());
  };

  return {
    register: baseRegister,
    emailRegisterOptions,
    passwordRegisterOptions,
    inputErrors,
    canSubmit,
    submitAccountStep,
  };
}
