import { fetchWithRefresh, proxyFailureError } from "@/core/api/server";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/member`;

    const response = await fetchWithRefresh(proxyUrl);

    if (!response.ok) throw Error("서버 불안정" + response.status);

    // 프록시 응답 받기
    const proxyResponse = await response.json();

    // 클라이언트에 프록시 응답 반환
    return Response.json({ ...proxyResponse.response }, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
