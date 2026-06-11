import { z } from "zod";

import { ClientApiError } from "./client-api-error";
import { CLIENT_API_ERROR_CODE } from "./constant";
import { resolveClientApiBody } from "./resolve-client-api-body";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ClientApiRequestBaseOptions<TResponse> = {
  url: string;
  method?: HttpMethod;
  headers?: HeadersInit;
  /** `AbortController`와 함께 타임아웃·취소에 사용 */
  signal?: AbortSignal;
  responseSchema: z.ZodType<TResponse>;
};

type ClientApiRequestBodyOptions<
  TRequestSchema extends z.ZodTypeAny | undefined
> = TRequestSchema extends z.ZodTypeAny
  ? {
      requestBodySchema: TRequestSchema;
      body: z.input<TRequestSchema>;
    }
  : {
      requestBodySchema?: undefined;
      body?: unknown;
    };

export type ClientApiRequestOptions<
  TResponse,
  TRequestSchema extends z.ZodTypeAny | undefined = undefined
> = ClientApiRequestBaseOptions<TResponse> &
  ClientApiRequestBodyOptions<TRequestSchema>;

export type ClientApiErrorCode =
  (typeof CLIENT_API_ERROR_CODE)[keyof typeof CLIENT_API_ERROR_CODE];

type ParsedJsonResult = { ok: true; data: unknown } | { ok: false; data: null };

function toRecord(headers?: HeadersInit): Record<string, string> {
  if (!headers) {
    return {};
  }

  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }

  return { ...headers };
}

function createRequestInit({
  method,
  headers,
  body,
}: {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: unknown;
}): RequestInit {
  const normalizedMethod = method ?? "GET";
  const normalizedHeaders = toRecord(headers);

  if (body instanceof FormData) {
    return {
      method: normalizedMethod,
      body,
      headers: normalizedHeaders,
    };
  }

  if (body !== undefined) {
    return {
      method: normalizedMethod,
      headers: {
        ...normalizedHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
  }

  return {
    method: normalizedMethod,
    headers: normalizedHeaders,
  };
}

function createClientApiError(params: {
  status: number;
  code: ClientApiErrorCode | string;
  message: string;
  payload?: unknown;
  details?: unknown;
}): ClientApiError {
  return new ClientApiError(params);
}

async function safeFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  try {
    return await fetch(input, { credentials: "include", ...init });
  } catch (error) {
    throw createClientApiError({
      status: 0,
      code: CLIENT_API_ERROR_CODE.NETWORK_ERROR,
      message: "네트워크 요청에 실패했습니다.",
      details: error,
    });
  }
}

async function parseJsonSafely(response: Response): Promise<ParsedJsonResult> {
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return { ok: false, data: null };
  }

  const data = await response.json().catch(() => null);
  if (data === null) {
    return { ok: false, data: null };
  }

  return { ok: true, data };
}

export async function clientApiRequest<
  TResponse,
  TRequestSchema extends z.ZodTypeAny | undefined = undefined
>({
  url,
  method = "GET",
  headers,
  body,
  requestBodySchema,
  responseSchema,
  signal,
}: ClientApiRequestOptions<TResponse, TRequestSchema>): Promise<TResponse> {
  if (body !== undefined && requestBodySchema) {
    const parsedRequestBody = requestBodySchema.safeParse(body);
    if (!parsedRequestBody.success) {
      throw createClientApiError({
        status: 0,
        code: CLIENT_API_ERROR_CODE.INVALID_REQUEST_BODY,
        message: "요청 바디 형식이 올바르지 않습니다.",
        payload: JSON.stringify(body),
        details: parsedRequestBody.error.issues,
      });
    }
  }

  const requestInitInput: {
    method?: HttpMethod;
    headers?: HeadersInit;
    body?: unknown;
  } = { method, body };
  if (headers !== undefined) {
    requestInitInput.headers = headers;
  }

  const init: RequestInit = createRequestInit(requestInitInput);
  if (signal !== undefined) {
    init.signal = signal;
  }

  const response = await safeFetch(url, init);
  const parsedJson = await parseJsonSafely(response);
  const raw = parsedJson.ok ? parsedJson.data : null;
  return resolveClientApiBody(
    raw,
    response.ok,
    response.status,
    responseSchema
  );
}
