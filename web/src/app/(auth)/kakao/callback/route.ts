import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// POST 요청으로 카카오 로그인 콜백 처리(수정 불가)
export async function GET(req: Request) {
  try {
    // 카카오에서 받은 인증 코드 또는 토큰 처리
    const reqUrl = new URL(req.url);
    const searchParams = reqUrl.searchParams;

    const accessToken = searchParams.get("token");
    const refreshToken = searchParams.get("refresh_token");
    const needRegister = searchParams.get("need_register");
    const signUpToken = searchParams.get("sign_up_token");
    const redirectURL = searchParams.get("redirectURL");

    const cookieStore = await cookies();

    if (
      accessToken &&
      accessToken !== "null" &&
      refreshToken &&
      refreshToken !== "null"
    ) {
      cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600,
      });

      cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 604800,
      });

      return Response.redirect(
        new URL(redirectURL ?? "/home", reqUrl).href,
        302
      );
    }

    if (needRegister === "true" && signUpToken) {
      cookieStore.set("signUpToken", signUpToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 300
      });

      return Response.redirect(new URL("/kakao/sign-up", reqUrl).href, 302);
    }

    return Response.redirect(new URL("/login", reqUrl).href, 302);
  } catch (error) {
    console.error("카카오 로그인 처리 중 에러:", error);
    return new Response(`카카오 로그인 실패: ${error}`, { status: 500 });
  }
}
