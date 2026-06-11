import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const friendRequestId = url.searchParams.get("friendRequestId") ?? "";

    const proxyUrl = new URL(`${process.env.BASE_URL}/api/friends/accept`);
    proxyUrl.searchParams.set("friendRequestId", friendRequestId);

    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "POST",
    });
    return await createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
