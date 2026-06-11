import { z } from "zod";

import { ClientApiError } from "./client-api-error";
import { CLIENT_API_ERROR_CODE } from "./constant";
import { resolveClientApiBody } from "./resolve-client-api-body";

type HttpMultipartMethod = "POST" | "PATCH" | "PUT";

export type ClientApiUploadProgressEvent = {
  lengthComputable: boolean;
  loaded: number;
  total: number;
};

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

/**
 * multipart `FormData` 업로드에 한정. `credentials: include` 로 쿠키를 실으며,
 * `upload.onprogress`로 전송 진행률을 알 수 있습니다.
 */
export function clientApiMultipartUploadRequest<TResponse>({
  url,
  method,
  formData,
  headers,
  responseSchema,
  onUploadProgress,
  onUploadFinished,
}: {
  url: string;
  method: HttpMultipartMethod;
  formData: FormData;
  headers?: HeadersInit;
  responseSchema: z.ZodType<TResponse>;
  onUploadProgress?: (evt: ClientApiUploadProgressEvent) => void;
  /** 요청 바디 전송 완료 직후(서버 응답 도착 전) 한 번 호출됩니다. */
  onUploadFinished?: () => void;
}): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open(method, url, true);

    const normalizedHeaders = toRecord(headers);

    /** FormData 업로드 때 Content-Type 생략(브라우저가 boundary 지정). */
    for (const [key, value] of Object.entries(normalizedHeaders)) {
      const lower = key.toLowerCase();
      if (
        lower !== "content-type" &&
        value !== undefined &&
        value !== null
      ) {
        xhr.setRequestHeader(key, value);
      }
    }

    if (onUploadProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        onUploadProgress({
          lengthComputable: e.lengthComputable,
          loaded: e.loaded,
          total: e.total,
        });
      });
    }

    xhr.upload.addEventListener("load", () => {
      onUploadFinished?.();
    });

    xhr.onerror = () => {
      reject(
        new ClientApiError({
          status: 0,
          code: CLIENT_API_ERROR_CODE.NETWORK_ERROR,
          message: "네트워크 요청에 실패했습니다.",
          details: xhr.statusText || null,
        })
      );
    };

    xhr.onload = () => {
      let raw: unknown;
      try {
        const text = xhr.responseText;
        if (!text.trim()) {
          reject(
            new ClientApiError({
              status: xhr.status,
              code: CLIENT_API_ERROR_CODE.INVALID_RESPONSE,
              message: "응답 형식이 올바르지 않습니다.",
              payload: undefined,
            })
          );
          return;
        }
        raw = JSON.parse(text) as unknown;
      } catch (error) {
        reject(
          new ClientApiError({
            status: xhr.status,
            code: CLIENT_API_ERROR_CODE.INVALID_RESPONSE,
            message: "응답 형식이 올바르지 않습니다.",
            details: error,
          })
        );
        return;
      }

      try {
        const httpOk = xhr.status >= 200 && xhr.status < 300;
        resolve(
          resolveClientApiBody(raw, httpOk, xhr.status, responseSchema)
        );
      } catch (error) {
        reject(error);
      }
    };

    xhr.send(formData);
  });
}
