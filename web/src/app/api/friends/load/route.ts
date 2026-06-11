import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const proxyUrl = new URL(`${process.env.BASE_URL}/api/friends`);
    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword");
    if (keyword !== null && keyword !== "") {
      proxyUrl.searchParams.set("keyword", keyword);
    }

    const proxyResponse = await fetchWithRefresh(proxyUrl);
    return await createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
