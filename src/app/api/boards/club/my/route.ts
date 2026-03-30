import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = url.searchParams.get("page") ?? "1";
    const size = url.searchParams.get("size") ?? "10";

    const proxyUrl = new URL(`${process.env.BASE_URL}/api/boards/club/my`);
    proxyUrl.searchParams.set("page", page);
    proxyUrl.searchParams.set("size", size);

    const proxyResponse = await fetchWithRefresh(proxyUrl);

    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    return proxyFailureError(error);
  }
}
