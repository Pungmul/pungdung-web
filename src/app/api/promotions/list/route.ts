import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/performances`;
    const proxyResponse = await fetchWithRefresh(proxyUrl);
    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    return proxyFailureError(error);
  }
}
