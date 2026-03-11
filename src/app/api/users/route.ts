import { fetchWithRefresh, proxyFailureError } from "@/core/api/server";

export const dynamic = "force-dynamic";

/** 프록시: 백엔드 `GET /api/member/users?keyword=` */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const keyword = url.searchParams.get("keyword") ?? "";

    const proxyUrl = new URL(`${process.env.BASE_URL}/api/member/users`);
    proxyUrl.searchParams.set("keyword", keyword);

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
