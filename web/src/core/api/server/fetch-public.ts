"use server";

import { cookies } from "next/headers";

import { refreshAccessToken } from "./fetchWithRefresh";
import { updateTokenCookies } from "./update-token-cookies";

/**
 * 공개 API를 호출한다. 유효한 access token이 있으면 개인화 응답을 유지하고,
 * 인증 실패 시 Authorization 없이 한 번만 다시 호출해 게스트 응답으로 전환한다.
 */
export async function fetchPublic(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const createHeaders = (token?: string) => {
    const headers = new Headers(init?.headers);
    headers.delete("Authorization");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  };

  const request = (headers: Headers) =>
    fetch(input, {
      ...init,
      headers,
    });

  const requestWithRefreshedToken = async (): Promise<Response | null> => {
    if (!refreshToken) return null;

    try {
      const tokens = await refreshAccessToken(refreshToken);
      await updateTokenCookies(tokens);

      const refreshedResponse = await request(
        createHeaders(tokens.accessToken)
      );

      return refreshedResponse.status === 401 ? null : refreshedResponse;
    } catch {
      return null;
    }
  };

  if (!accessToken) {
    return (await requestWithRefreshedToken()) ?? request(createHeaders());
  }

  const response = await request(createHeaders(accessToken));

  if (response.status !== 401) {
    return response;
  }

  return (await requestWithRefreshedToken()) ?? request(createHeaders());
}
