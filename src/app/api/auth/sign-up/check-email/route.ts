import {
  proxyFailureError,
  validateUpstreamJsonResponse,
} from "@/core/api/server";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json(
        {
          code: "INVALID_REQUEST",
          message: "이메일이 필요합니다.",
          response: null,
          isSuccess: false,
        },
        { status: 400 }
      );
    }

    const proxyUrl = new URL(`${process.env.BASE_URL}/api/member/signup/check`);
    proxyUrl.searchParams.set("username", email);

    const response = await fetch(proxyUrl);
    const parsed = await validateUpstreamJsonResponse(response);
    if (!parsed.ok) {
      return Response.json(parsed.error.body, { status: parsed.error.status });
    }
    return Response.json(parsed.data, { status: response.status });
  } catch (error) {
    console.error("이메일 중복 체크 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
