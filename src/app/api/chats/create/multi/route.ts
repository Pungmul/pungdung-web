import { fetchWithRefresh, proxyFailureError } from "@/core/api/server";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/chat/multi`;
    const body = await req.json();

    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const { response } = await proxyResponse.json();
    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
