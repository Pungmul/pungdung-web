"use server";

import { cookies } from "next/headers";
import { AuthError } from "./auth-error.class";
import { updateTokenCookies } from "./update-token-cookies";
import { clearTokenCookies } from "./clean-token-cookies";
import { RefreshTokenResponse } from "./type";

const MAX_RETRY = 5;

export async function fetchWithRefresh(
  input: RequestInfo | URL,
  init?: RequestInit,
  retryCount = 0
): Promise<Response> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      console.warn("refreshToken is not exist");
      throw new AuthError("Authentication required - please login");
    }

    // accessToken이 없으면 먼저 재발급 시도
    if (!accessToken) {
      const newTokens = await refreshAccessToken(refreshToken);
      updateTokenCookies(newTokens);
    }

    // 새로운 accessToken 가져오기
    const newAccessToken = cookieStore.get("accessToken")?.value;

    // 원래 요청 실행
    const response = await fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${newAccessToken}`,
      },
    });

    // 401이 아닌 경우 그대로 반환
    if (response.status !== 401 && response.status !== 403) {
      return response;
    }

    // 401 응답이고 재시도 횟수 초과한 경우
    if (retryCount >= MAX_RETRY) {
      throw new AuthError("Authentication failed - please login again");
    }

    // 토큰 재발급 후 재시도
    const newTokens = await refreshAccessToken(refreshToken);
    updateTokenCookies(newTokens);

    // 새 토큰으로 원래 요청 재시도
    return fetchWithRefresh(input, init, retryCount + 1);
  } catch (error) {
    // 토큰 관련 에러인 경우 쿠키 정리
    if (
      error instanceof Error &&
      // (error.message.includes("Authentication") ||
      error.message.includes("token")
    ) {
      clearTokenCookies();
    }
    throw error;
  }
}

async function refreshAccessToken(
  refreshToken: string
): Promise<RefreshTokenResponse> {
  const refreshResponse = await fetch(
    `${process.env.BASE_URL}/api/member/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        refreshToken: refreshToken,
      },
    }
  );

  if (!refreshResponse.ok) {
    throw new AuthError("Token refresh failed - please login again");
  }

  const { response } = await refreshResponse.json();
  const { accessToken, refreshToken: newRefreshToken } = response;

  if (!accessToken) {
    throw new AuthError("Invalid token response");
  }

  return { accessToken, refreshToken: newRefreshToken };
}
