import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await fetchWithRefresh(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/lightning/withdraw`,
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
    return proxyFailureError(error, "번개 모임 나가기에 실패했습니다.");
  }
}
