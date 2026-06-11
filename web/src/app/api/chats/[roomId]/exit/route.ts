import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;

    const proxyUrl = `${process.env.BASE_URL}/api/chat/withdraw/${roomId}`;

    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "POST",
    });

    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
