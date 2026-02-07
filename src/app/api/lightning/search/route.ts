import { fetchWithRefresh, proxyFailureError } from "@/core/api/server";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/lightning/search`;

    const proxyResponse = await fetchWithRefresh(proxyUrl);

    if (!proxyResponse.ok) {
      const errorText = await proxyResponse.text(); // 또는 await res.json()
      console.error("🔥 백엔드 에러 메시지:", errorText);
      throw Error("🔥서버 불안정" + proxyResponse.status);
    }

    const { response } = await proxyResponse.json();

    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
