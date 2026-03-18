import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/message/fcm/unread`;
    const proxyResponse = await fetchWithRefresh(proxyUrl);
    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
