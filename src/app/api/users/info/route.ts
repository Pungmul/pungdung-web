import { fetchWithRefresh, proxyFailureError } from "@/core/api/server";

export const dynamic = "force-dynamic";

/** 프록시: 백엔드 `GET /api/member/users/info?username=` (username은 이메일 형태일 수 있음) */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const username = url.searchParams.get("username") ?? "";

    const proxyUrl = new URL(`${process.env.BASE_URL}/api/member/users/info`);
    proxyUrl.searchParams.set("username", username);

    const proxyResponse = await fetchWithRefresh(proxyUrl);

    if (!proxyResponse.ok) {
      throw Error("서버 불안정" + proxyResponse.status);
    }

    const { response } = await proxyResponse.json();
    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
