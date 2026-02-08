"use client";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { authMutationOptions } from "../../queries";
import { useLoginStore } from "../../store";
import { LoginFormType, loginSchema } from "../../types/schemas";

export const useLoginForm = () => {
  const router = useRouter();
  const setLogin = useLoginStore((state) => state.setLogin);
  const {
    mutate: loginRequest,
    error: requestError,
    isPending,
  } = useMutation(authMutationOptions.login());

  const {
    register,
    handleSubmit,
    formState: { errors: inputErrors, isValid },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      loginId: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormType) => {
    loginRequest(data, {
      onSuccess: () => {
        setLogin("email");
        router.replace("/home");
      },
    });
  };

  return {
    register,
    inputErrors,
    isValid,
    isPending,
    handleSubmit,
    onSubmit,
    requestError,
  };
};
