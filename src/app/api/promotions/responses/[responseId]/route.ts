import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ responseId: string }> }
) {
  try {
    const { responseId } = await params;
    if (!responseId) {
      return Response.json(
        {
          code: "INVALID_REQUEST",
          message: "responseId가 없습니다.",
          response: null,
          isSuccess: false,
        },
        { status: 400 }
      );
    }
    const proxyUrl = `${process.env.BASE_URL}/api/performances/responses/${responseId}`;
    const proxyResponse = await fetchWithRefresh(proxyUrl);
    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    return proxyFailureError(error);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ responseId: string }> }
) {
  try {
    const { responseId } = await params;
    const proxyUrl = `${process.env.BASE_URL}/api/performances/responses/${responseId}`;

    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "DELETE",
    });
    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    return proxyFailureError(error);
  }
}
