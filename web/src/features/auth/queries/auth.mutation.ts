import { mutationOptions } from "@tanstack/react-query";

import { authQueryInternal } from "./auth-query-internal";
import {
  requestKakaoSignUp,
  requestLogin,
  requestPasswordResetEmail,
  requestSignUp,
  resetPassword,
  updatePassword,
  updateProfile,
} from "../api/client";
import type { ChangePasswordRequest } from "../api/client/dto.schema";

const root = authQueryInternal.all();

/** useMutation에 넘길 옵션. useMutation(authMutationOptions.login()) */
export const authMutationOptions = {
  signUp: () =>
    mutationOptions({
      mutationKey: [...root, "signUp"],
      mutationFn: requestSignUp,
    }),

  kakaoSignUp: () =>
    mutationOptions({
      mutationKey: [...root, "kakaoSignUp"],
      mutationFn: requestKakaoSignUp,
    }),

  login: () =>
    mutationOptions({
      mutationKey: [...root, "login"],
      mutationFn: requestLogin,
    }),

  resetPassword: () =>
    mutationOptions({
      mutationKey: [...root, "resetPassword"],
      mutationFn: resetPassword,
    }),

  requestPasswordResetEmail: () =>
    mutationOptions({
      mutationKey: [...root, "requestPasswordResetEmail"],
      mutationFn: requestPasswordResetEmail,
    }),

  changePassword: () =>
    mutationOptions<void, Error, ChangePasswordRequest>({
      mutationKey: [...root, "changePassword"],
      mutationFn: updatePassword,
    }),

  updateProfile: () =>
    mutationOptions<unknown, Error, FormData>({
      mutationKey: [...root, "updateProfile"],
      mutationFn: updateProfile,
    }),
};
