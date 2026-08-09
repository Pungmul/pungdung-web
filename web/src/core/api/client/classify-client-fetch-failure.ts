import {
  CLIENT_API_ERROR_CODE,
  CLIENT_FETCH_TIMEOUT_ABORT_REASON,
} from "./constant";

function isNamedError(value: unknown, name: string): boolean {
  return Boolean(
    value &&
      typeof value === "object" &&
      "name" in value &&
      value.name === name
  );
}

function isTimeoutAbortReason(reason: unknown): boolean {
  if (reason === CLIENT_FETCH_TIMEOUT_ABORT_REASON) {
    return true;
  }
  return isNamedError(reason, "TimeoutError");
}

export function isClientRequestTimeout(
  error: unknown,
  signal?: AbortSignal
): boolean {
  if (isNamedError(error, "TimeoutError")) {
    return true;
  }
  if (!isNamedError(error, "AbortError")) {
    return false;
  }
  return isTimeoutAbortReason(signal?.reason);
}

export function getClientFetchFailureCode(
  error: unknown,
  signal?: AbortSignal
) {
  if (isClientRequestTimeout(error, signal)) {
    return CLIENT_API_ERROR_CODE.CLIENT_TIMEOUT;
  }
  return CLIENT_API_ERROR_CODE.NETWORK_ERROR;
}
