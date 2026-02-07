import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const refreshToken = cookieStore.get("refreshToken");
  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        code: "UNAUTHORIZED",
        message: "인증 정보가 없습니다.",
        response: null,
        isSuccess: false,
      },
      { status: 401 }
    );
  }
  return Response.json(
    {
      code: "SUCCESS",
      message: "토큰 조회 성공",
      response: { accessToken: accessToken.value },
      isSuccess: true,
    },
    { status: 200 }
  );
}
