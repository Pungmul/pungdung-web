import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const keyword = url.searchParams.get("keyword") ?? "";

    const proxyUrl = new URL(`${process.env.BASE_URL}/api/friends/request`);
    proxyUrl.searchParams.set("keyword", keyword);

    const proxyResponse = await fetchWithRefresh(proxyUrl);
    return await createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
