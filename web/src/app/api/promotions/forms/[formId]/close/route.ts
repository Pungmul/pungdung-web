import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function PATCH(
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

    const proxyUrl = `${process.env.BASE_URL}/api/performances/${formIdNumber}/close`;
    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "PATCH",
    });
    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    return proxyFailureError(error);
  }
}
