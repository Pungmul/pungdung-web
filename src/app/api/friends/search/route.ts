import { fetchWithRefresh, proxyFailureError } from "@/core/api/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const keyword = url.searchParams.get("keyword") ?? "";

    const proxyUrl = new URL(`${process.env.BASE_URL}/api/friends/request`);
    proxyUrl.searchParams.set("keyword", keyword);

    const proxyResponse = await fetchWithRefresh(proxyUrl);

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    // 프록시 응답 받기
    const { response } = await proxyResponse.json();
    // 클라이언트에 프록시 응답 반환
    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
