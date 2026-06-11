import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ boardID: string }> }
) {
  try {
    const url = new URL(req.url);
    const { boardID } = await params;

    const page = url.searchParams.get("page");
    const size = url.searchParams.get("size");

    const proxyUrl = new URL(`${process.env.BASE_URL}/api/boards/${boardID}`);

    if (page) proxyUrl.searchParams.set("page", page);

    if (size) proxyUrl.searchParams.set("size", size);

    const proxyResponse = await fetchWithRefresh(proxyUrl);

    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    return proxyFailureError(error);
  }
}
