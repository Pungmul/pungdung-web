import { z } from "zod";

import { ClientApiError } from "@/core/api/client/client-api-error";
import { ClientMapperError } from "@/core/api/client/client-mapper-error";

import { classifyClientApiError } from "./classify-client-api-error";
import {
  type ClassifiedAppError,
  type ReportAppErrorContext,
  SOCKET_BROKER_ERROR_NAME,
  SOCKET_CONTRACT_ERROR_NAME,
  type SocketBrokerError,
} from "./report-app-error.types";
import { getSocketContractExtras } from "./report-app-error-extras";

export function classifyAppError(
  error: unknown,
  ctx: ReportAppErrorContext
): ClassifiedAppError {
  if (isAbortError(error) || isAuthError(error) || isFormZodError(error)) {
    return { action: "drop" };
  }
  if (error instanceof ClientApiError) {
    return classifyClientApiError(error, ctx);
  }
  if (error instanceof ClientMapperError) {
    return { action: "report", errorKind: "mapper", extras: {} };
  }
  if (isNamedError(error, SOCKET_CONTRACT_ERROR_NAME)) {
    return {
      action: "report",
      errorKind: "contract",
      extras: getSocketContractExtras(error),
    };
  }
  if (isNamedError(error, SOCKET_BROKER_ERROR_NAME)) {
    const brokerReason = (error as SocketBrokerError).brokerReason;
    return {
      action: "report",
      errorKind: "http",
      extras: brokerReason ? { broker_reason: brokerReason } : {},
    };
  }
  return { action: "report", errorKind: "unknown", extras: {} };
}

function isAbortError(error: unknown): boolean {
  return isNamedError(error, "AbortError");
}

function isAuthError(error: unknown): boolean {
  return isNamedError(error, "AuthError");
}

function isFormZodError(error: unknown): boolean {
  return error instanceof z.ZodError;
}

function isNamedError(error: unknown, name: string): error is Error {
  return Boolean(
    error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === name
  );
}
