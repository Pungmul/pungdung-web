import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;

    if (!postId) {
      return Response.json(
        {
          code: "INVALID_REQUEST",
          message: "postId가 없습니다.",
          response: null,
          isSuccess: false,
        },
        { status: 400 }
      );
    }

    const { content, parentId, anonymity } = await req.json();

    const proxyUrl = parentId
      ? `${process.env.BASE_URL}/api/comments/${parentId}?postId=${postId}`
      : `${process.env.BASE_URL}/api/comments?postId=${postId}`;

    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: !parentId
        ? JSON.stringify({ content, anonymity })
        : JSON.stringify({ content, parentId, anonymity }),
    });

    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
