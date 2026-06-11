import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ boardID: string }> }
) {
  try {
    const { boardID } = await params;
    const boardId = parseInt(boardID, 10);
    if (Number.isNaN(boardId)) {
      return Response.json(
        {
          code: "INVALID_REQUEST",
          message: "잘못된 요청입니다.",
          response: null,
          isSuccess: false,
        },
        { status: 400 }
      );
    }
    const proxyUrl = `${process.env.BASE_URL}/api/boards/${boardId}`;
    const proxyResponse = await fetchWithRefresh(proxyUrl);

    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    return proxyFailureError(error);
  }
}
