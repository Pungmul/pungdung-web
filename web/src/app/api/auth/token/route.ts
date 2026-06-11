import { cookies } from "next/headers";

import { refreshAuthToken } from "@/features/auth/api/server/refresh-auth-token.api";

export const dynamic = "force-dynamic";

const secureCookie = process.env.NODE_ENV === "production";

const unauthorizedResponse = () =>
  Response.json(
    {
      code: "UNAUTHORIZED",
      message: "인증 정보가 없습니다.",
      response: null,
      isSuccess: false,
    },
    { status: 401 },
  );

export async function GET() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return unauthorizedResponse();
  }

  let accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    try {
      const reissued = await refreshAuthToken();
      cookieStore.set("accessToken", reissued.accessToken, {
        httpOnly: true,
        secure: secureCookie,
        sameSite: "strict",
        path: "/",
        maxAge: reissued.expiresIn,
      });
      cookieStore.set("refreshToken", reissued.refreshToken, {
        httpOnly: true,
        secure: secureCookie,
        sameSite: "strict",
        path: "/",
        maxAge: reissued.refreshTokenExpiresIn,
      });
      accessToken = reissued.accessToken;
    } catch {
      return unauthorizedResponse();
    }
  }

  if (!accessToken) {
    return unauthorizedResponse();
  }

  return Response.json(
    {
      code: "SUCCESS",
      message: "토큰 조회 성공",
      response: { accessToken },
      isSuccess: true,
    },
    { status: 200 },
  );
}
