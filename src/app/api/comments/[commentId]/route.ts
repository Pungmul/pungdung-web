import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;

    const proxyUrl = `${process.env.BASE_URL}/api/comments/${commentId}/delete`;

    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "DELETE",
    });

    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    console.error(error);
    return proxyFailureError(error);
  }
}
