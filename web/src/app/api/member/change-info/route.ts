import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export async function GET() {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/member/changeInfo`;
    const response = await fetchWithRefresh(proxyUrl);
    return createValidatedUpstreamResponse(response);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
