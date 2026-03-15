import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const { searchParams } = new URL(request.url);
    const size = searchParams.get("size") ?? "20";
    const beforeId = searchParams.get("beforeId");
    const upstream = new URL(
      `${process.env.BASE_URL}/api/chat/${roomId}/message`
    );
    upstream.searchParams.set("size", size);
    if (beforeId) {
      upstream.searchParams.set("beforeId", beforeId);
    }
    const proxyUrl = upstream.toString();

    const proxyResponse = await fetchWithRefresh(proxyUrl);

    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
