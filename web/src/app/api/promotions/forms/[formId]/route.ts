import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await params;
    const proxyUrl = `${process.env.BASE_URL}/api/performances/${formId}/draft`;
    const proxyResponse = await fetchWithRefresh(proxyUrl);
    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    return proxyFailureError(error);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await params;
    const formIdNumber = parseInt(formId, 10);
    if (!formId || Number.isNaN(formIdNumber)) {
      return Response.json(
        {
          code: "INVALID_REQUEST",
          message: "formId는 숫자여야 합니다.",
          response: null,
          isSuccess: false,
        },
        { status: 400 }
      );
    }

    // GET draft와 달리 삭제 업스트림은 /performances/{formId}
    const proxyUrl = `${process.env.BASE_URL}/api/performances/${formIdNumber}`;
    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "DELETE",
    });
    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    return proxyFailureError(error);
  }
}
