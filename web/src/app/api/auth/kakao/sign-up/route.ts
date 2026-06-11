import { cookies } from "next/headers";

import {
  proxyFailureError,
  validateUpstreamJsonResponse,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/member/kakao/register`;

    const form = await req.json();
    const cookieStore = await cookies();

    const signUpToken = cookieStore.get("signUpToken")?.value;
    const formData = new FormData();

    const accountData = new Blob([JSON.stringify({ ...form, signUpToken })], {
      type: "application/json",
    });
    formData.append("accountData", accountData);
    formData.append("profile", new Blob([], { type: "image/png" }));

    const response = await fetch(proxyUrl, {
      method: "POST",
      body: formData,
    });
    const parsed = await validateUpstreamJsonResponse(response);
    if (!parsed.ok) {
      return Response.json(parsed.error.body, { status: parsed.error.status });
    }

    const proxyResponse = parsed.data;
    if (!response.ok || !proxyResponse.isSuccess) {
      return Response.json(proxyResponse, { status: response.status });
    }

    const tokenPayload =
      typeof proxyResponse.response === "object" &&
      proxyResponse.response !== null
        ? (proxyResponse.response as {
            accessToken?: string;
            expiresIn?: number;
            refreshToken?: string;
            refreshTokenExpiresIn?: number;
          })
        : undefined;

    const { accessToken, expiresIn, refreshToken, refreshTokenExpiresIn } =
      tokenPayload ?? {};

    if (!accessToken || !refreshToken || !expiresIn || !refreshTokenExpiresIn) {
      return Response.json(
        {
          code: proxyResponse.code,
          message: proxyResponse.message || "Token is not valid!",
          response: proxyResponse.response,
          isSuccess: false,
        },
        { status: 400 }
      );
    }

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn,
    });
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: refreshTokenExpiresIn,
    });
    cookieStore.delete("signUpToken");

    return Response.json(
      {
        ...proxyResponse,
        response: "회원가입 및 로그인이 정상적으로 완료됐습니다.",
      },
      { status: response.status }
    );
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
