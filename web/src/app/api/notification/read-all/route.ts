import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function PATCH() {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/message/fcm/read-all`;

    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "PATCH",
    });

    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
