import {
  proxyFailureError,
  validateUpstreamJsonResponse,
} from "@/core/api/server";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { loginId, password }: { loginId: string; password: string } =
    await req.json();

  if (!loginId || !password)
    return Response.json(
      {
        code: "INVALID_REQUEST",
        message: "아이디와 비밀번호를 확인해주세요.",
        response: null,
        isSuccess: false,
      },
      { status: 400 }
    );

  try {
    const proxyUrl = `${process.env.BASE_URL}/api/member/login`;

    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ loginId, password }),
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

    if (!tokenPayload?.accessToken || !tokenPayload?.refreshToken) {
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

    const { accessToken, expiresIn, refreshToken, refreshTokenExpiresIn } =
      tokenPayload;

    const headers = new Headers();

    headers.append(
      "Set-Cookie",
      `accessToken=${accessToken}; Path=/; SameSite=Strict; HttpOnly; Max-Age=${expiresIn}`
    );
    headers.append(
      "Set-Cookie",
      `refreshToken=${refreshToken}; Path=/; SameSite=Strict; HttpOnly; Max-Age=${refreshTokenExpiresIn}`
    );
    return Response.json(
      { ...proxyResponse, response: "로그인이 정상적으로 완료됐습니다." },
      { status: response.status, headers }
    );
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
