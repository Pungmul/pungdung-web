import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const proxyUrl = `${process.env.BASE_URL}/api/posts/${postId}/like`;

    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
