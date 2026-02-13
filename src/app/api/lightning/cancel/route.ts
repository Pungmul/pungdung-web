import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";
export const dynamic = "force-dynamic";

//응답 {"code":"2000","message":"성공","response":{"message":"모임이 취소되었습니다."},"isSuccess":true}%
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await fetchWithRefresh(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/lightning/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    return await createValidatedUpstreamResponse(response);
  } catch (error) {
    console.error(error);
    return proxyFailureError(error, "번개 모임 취소에 실패했습니다.");
  }
}
