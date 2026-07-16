import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const postId = new URL(req.url).searchParams.get("postId");

    if (!postId || !/^\d+$/.test(postId)) {
      return Response.json(
        {
          code: "INVALID_REQUEST",
          message: "postId는 숫자여야 합니다.",
          response: null,
          isSuccess: false,
        },
        { status: 400 }
      );
    }

    const proxyResponse = await fetchWithRefresh(
      `${process.env.BASE_URL}/api/comments?postId=${postId}`
    );

    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
