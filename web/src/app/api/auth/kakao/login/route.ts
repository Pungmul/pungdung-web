import { proxyFailureError } from "@/core/api/server";

export const dynamic = "force-dynamic";

// GET 요청으로 카카오 로그인 리디렉션
export async function GET(req: Request) {
  try {
    // 카카오 OAuth 로그인 URL로 리디렉션

    const searchParams = new URLSearchParams(req.url);
    const redirectURL = searchParams.get("redirectURL");

    const kakaoLoginUrl = `${process.env.BASE_URL}/api/member/kakao/login`;

    return Response.redirect(
      `${kakaoLoginUrl}?redirectURL=${redirectURL}`,
      302
    );
  } catch (error) {
    console.error("카카오 로그인 리디렉션 에러:", error);
    return proxyFailureError(error, "카카오 로그인 리디렉션에 실패했습니다.");
  }
}
