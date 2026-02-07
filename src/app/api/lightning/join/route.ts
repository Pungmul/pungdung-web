import { fetchWithRefresh, proxyFailureError } from "@/core/api/server";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetchWithRefresh(
      `${process.env.BASE_URL}/api/lightning`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text(); // 또는 await res.json()
      console.error("🔥 백엔드 에러 메시지:", errorText);
      throw Error("서버 불안정" + response.status);
    }

    return Response.json(response);
  } catch (error) {
    console.error(error);
    return proxyFailureError(error, "번개 모임 참여에 실패했습니다.");
  }
}
