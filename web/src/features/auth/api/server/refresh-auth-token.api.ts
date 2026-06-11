"use server";
/**
 * 서버 런타임 전용 API.
 * cookies(), 서버 전용 환경 변수, 절대 경로 fetch 등을 사용하므로
 * 클라이언트 번들에 포함되면 안 된다.
 */
import { cookies } from "next/headers";

import {
  type RefreshAuthTokenResponse,
  refreshAuthTokenResponseSchema,
} from "./dto.schema";

export const refreshAuthToken = async (): Promise<RefreshAuthTokenResponse> => {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }

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
      throw new Error("Token refresh failed - please login again");
    }

    const { response } = await refreshResponse.json();
    const {
      accessToken: newAccessToken,
      expiresIn,
      refreshToken: newRefreshToken,
      refreshTokenExpiresIn,
    } = response;

    if (!newAccessToken) {
      throw new Error("Invalid token response");
    }

    return refreshAuthTokenResponseSchema.parse({
      accessToken: newAccessToken,
      expiresIn,
      refreshToken: newRefreshToken,
      refreshTokenExpiresIn,
    });
  } catch (error) {
    console.error("Token refresh failed: refresh token missing", error);

    await clearAuthCookies();

    throw new Error("Authentication expired");
  }
};

async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}
