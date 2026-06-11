import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await params;
    const formData = await req.formData();
    const proxyUrl = `${process.env.BASE_URL}/api/performances/${formId}/image`;
    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "POST",
      body: formData,
    });
    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    return proxyFailureError(error);
  }
}
