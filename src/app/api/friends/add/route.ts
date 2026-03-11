import { fetchWithRefresh, proxyFailureError } from "@/core/api/server";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const friendId: string = url.searchParams.get("friendId") ?? "";

    const proxyUrl = `${process.env.BASE_URL}/api/friends/request?receiverUsername=${friendId}`;

    const response = await fetchWithRefresh(proxyUrl, {
      method: "POST",
    });

    if (!response.ok) {
      console.error("서버 불안정", response.status);
      const errorText = await response.text();
      console.error("서버 오류:", errorText);
      throw Error("서버 불안정" + response.status);
    }
    // 클라이언트에 프록시 응답 반환
    return Response.json("Success", { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
