import { proxyFailureError } from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const {
    accessToken,
    refreshToken,
  }: { accessToken: string; refreshToken: string } = await req.json();

  if (!accessToken || !refreshToken)
    return new Response(
      `Error: wrongData:${!accessToken && "accessToken"} ${
        !refreshToken && "refreshToken"
      } ${!accessToken && !refreshToken ? "are" : "is"} not exist `,
      { status: 500 }
    );

  try {
    const proxyUrl = `${process.env.BASE_URL}/api/member`;

    const response = await fetch(proxyUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw Error("서버 불안정" + response.status);

    // 프록시 응답 받기
    const headers = new Headers();

    headers.append(
      "Set-Cookie",
      `accessToken=${accessToken}; Path=/; SameSite=Strict; Max-Age=${
        60 * 60 * 1000
      }`
    );
    headers.append(
      "Set-Cookie",
      `refreshToken=${refreshToken}; Path=/; SameSite=Strict; Max-Age=${604800}`
    );
    // 클라이언트에 프록시 응답 반환
    return Response.json({ message: "success to issue cookies" }, { headers });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
