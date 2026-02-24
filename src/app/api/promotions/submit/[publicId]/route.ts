import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    const { publicId } = await params;
    const body = await req.json();
    const { answers } = body;

    const proxyUrl = `${process.env.BASE_URL}/forms/p/${publicId}`;
    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers }),
    });

    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    return proxyFailureError(error);
  }
}
