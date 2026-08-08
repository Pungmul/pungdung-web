import { ClientApiError } from "@/core/api/client/client-api-error";
import { CLIENT_API_ERROR_CODE } from "@/core/api/client/constant";

import type {
  SocketContractError,
  ZodIssueSummary,
} from "./report-app-error.types";
import { ROUTE_FAILURE_CODE } from "../route-failure-code";

// Sentry extra
// status, api_code, payload 바이트, Zod path/code만
// 바디 원문 없음
export function buildClientApiExtras(
  error: ClientApiError
): Record<string, unknown> {
  const extras: Record<string, unknown> = {
    http_status: error.status,
    api_code: error.code,
  };
  const contractLayer = getContractLayer(error.code);
  if (contractLayer) {
    extras.contract_layer = contractLayer;
  }
  const payloadBytes = getPayloadByteLength(error.payload);
  if (payloadBytes !== undefined) {
    extras.payload_bytes = payloadBytes;
  }
  const zodIssues = getZodIssueSummaries(error.details);
  if (zodIssues) {
    extras.zod_issues = zodIssues;
  }
  return extras;
}

// Route Handler/클라 envelope 어디가 깨졌는지
function getContractLayer(code: string): string | undefined {
  if (code === CLIENT_API_ERROR_CODE.INVALID_RESPONSE) {
    return "client_envelope";
  }
  if (code === CLIENT_API_ERROR_CODE.INVALID_RESPONSE_SCHEMA) {
    return "client_dto";
  }
  if (
    code === ROUTE_FAILURE_CODE.UPSTREAM_INVALID_JSON ||
    code === ROUTE_FAILURE_CODE.UPSTREAM_INVALID_RESPONSE
  ) {
    return "upstream_envelope";
  }
  if (code === ROUTE_FAILURE_CODE.PROXY_FAILURE) {
    return "route_proxy";
  }
  return undefined;
}

// 소켓 계약 실패 extra
// Zod path/code만
// 프레임 본문 없음
export function getSocketContractExtras(error: Error): Record<string, unknown> {
  const zodIssues = (error as SocketContractError).zodIssues;
  if (!zodIssues || zodIssues.length === 0) {
    return {};
  }
  return { zod_issues: zodIssues };
}

// Zod received 값 제외
// path와 code만
function getZodIssueSummaries(details: unknown): ZodIssueSummary[] | undefined {
  if (!Array.isArray(details)) {
    return undefined;
  }
  const issues = details.flatMap((item) => {
    if (!item || typeof item !== "object" || !("code" in item)) {
      return [];
    }
    const path =
      "path" in item && Array.isArray(item.path)
        ? item.path.map(String).join(".")
        : "";
    return [{ path, code: String(item.code) }];
  });
  return issues.length > 0 ? issues : undefined;
}

// payload 크기만
// JSON 원문은 extra에 안 넣음
function getPayloadByteLength(payload: unknown): number | undefined {
  if (typeof payload === "string") {
    return new TextEncoder().encode(payload).length;
  }
  if (payload == null) {
    return undefined;
  }
  try {
    return new TextEncoder().encode(JSON.stringify(payload)).length;
  } catch {
    return undefined;
  }
}
