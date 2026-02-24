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
    const body = await req.json();
    const proxyUrl = `${process.env.BASE_URL}/api/performances/${formId}/draft`;
    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    return proxyFailureError(error);
  }
}
