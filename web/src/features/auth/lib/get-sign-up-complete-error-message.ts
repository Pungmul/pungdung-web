import { ClientApiError } from "@/core/api/client";

import { AUTH_DOMAIN_MESSAGE } from "../constants";

const DELETED_ACCOUNT_CODE = "MEMBER_004";

export function isDeletedAccountSignUpError(error: Error): boolean {
  return error instanceof ClientApiError && error.code === DELETED_ACCOUNT_CODE;
}

export function getSignUpCompleteErrorMessage(error: Error): string {
  if (isDeletedAccountSignUpError(error)) {
    return AUTH_DOMAIN_MESSAGE.SIGN_UP_COMPLETE.DELETED_ACCOUNT;
  }

  return (
    error.message || AUTH_DOMAIN_MESSAGE.SIGN_UP_COMPLETE.GENERIC_ERROR
  );
}
