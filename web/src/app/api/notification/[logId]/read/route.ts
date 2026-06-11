import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ logId: string }> }
) {
  try {
    const { logId } = await params;
    const proxyUrl = `${process.env.BASE_URL}/api/message/fcm/${logId}/read`;

    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "PATCH",
    });

    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
