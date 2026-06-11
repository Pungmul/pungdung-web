"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterOptions, useForm, useWatch } from "react-hook-form";

import { AUTH_DOMAIN_MESSAGE, AUTH_VALIDATION } from "../../constants";
import { authMutationOptions, authQueries } from "../../queries";
import { type EmailCheckFormData, emailCheckSchema } from "../../types/schemas";

export function useEmailCheckForm(options: { onSuccess: () => void }) {
  const { onSuccess } = options;

  const {
    register,
    control,
    handleSubmit,
    setError: setInputError,
    formState: { errors: inputErrors, isValid },
  } = useForm<EmailCheckFormData>({
    resolver: zodResolver(emailCheckSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });
  const email = useWatch({ control, name: "email" });
  const { refetch: refetchEmailExists, isFetching: isCheckingEmail } = useQuery(
    authQueries.emailExists(email)
  );

  const emailRegisterOptions: RegisterOptions<EmailCheckFormData, "email"> = {
    onBlur: async () => {
      try {
        const { data } = await refetchEmailExists();
        if (data?.isRegistered) {
          setInputError("email", {
            type: "validate",
            message: AUTH_VALIDATION.EMAIL_CHECK.NOT_REGISTERED,
          });
        }
      } catch {
        setInputError("email", {
          type: "validate",
          message: AUTH_VALIDATION.UNKNOWN_ERROR,
        });
      }
    },
  };

  const { mutate: requestPasswordResetEmail, isPending } = useMutation({
    ...authMutationOptions.requestPasswordResetEmail(),
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || AUTH_DOMAIN_MESSAGE.RESET_PASSWORD.ERROR;
      setInputError("email", { type: "manual", message: errorMessage });
    },
  });

  const onSubmit = (data: EmailCheckFormData) => {
    requestPasswordResetEmail({ email: data.email });
  };

  return {
    register,
    handleSubmit,
    emailRegisterOptions,
    isCheckingEmail,
    inputErrors,
    isValid,
    isPending,
    onSubmit,
  };
}
