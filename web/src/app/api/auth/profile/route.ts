import {
  fetchWithRefresh,
  proxyFailureError,
  validateUpstreamJsonResponse,
} from "@/core/api/server";

export async function PATCH(req: Request) {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/member`;
    const formData = await req.formData();

    const response = await fetchWithRefresh(proxyUrl, {
      method: "PATCH",
      body: formData,
    });
    const parsed = await validateUpstreamJsonResponse(response);
    if (!parsed.ok) {
      return Response.json(parsed.error.body, { status: parsed.error.status });
    }

    return Response.json(parsed.data, { status: response.status });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
