import { fetchWithRefresh, proxyFailureError } from "@/core/api/server";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const friendRequestId: number = Number(
      url.searchParams.get("friendRequestId")
    );

    const proxyUrl = `${process.env.BASE_URL}/api/friends/decline?friendRequestId=${friendRequestId}`;

    const response = await fetchWithRefresh(proxyUrl, {
      method: "POST",
    });

    if (!response.ok) throw Error("서버 불안정" + response.status);
    // 클라이언트에 프록시 응답 반환
    return Response.json("Success", { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
