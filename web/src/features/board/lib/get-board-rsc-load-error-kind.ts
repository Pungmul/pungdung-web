import { ClientApiError } from "@/core/api/client/client-api-error";
import { ClientMapperError } from "@/core/api/client/client-mapper-error";
import { CLIENT_API_ERROR_CODE } from "@/core/api/client/constant";

import type { BoardRscLoadErrorKind } from "../types";

export function getBoardRscLoadErrorKind(
  error: unknown
): BoardRscLoadErrorKind {
  if (error instanceof ClientMapperError) {
    return "contract";
  }
  if (!(error instanceof ClientApiError)) {
    return "unknown";
  }
  if (
    error.code === CLIENT_API_ERROR_CODE.INVALID_RESPONSE ||
    error.code === CLIENT_API_ERROR_CODE.INVALID_RESPONSE_SCHEMA
  ) {
    return "contract";
  }
  return "http";
}
