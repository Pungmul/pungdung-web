import {
  createValidatedUpstreamResponse,
  fetchPublic,
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

    const suffix = page && Number(page) > 1 ? "/add" : "";
    const proxyUrl = new URL(`${process.env.BASE_URL}/api/boards/${boardID}${suffix}`);

    if (page) proxyUrl.searchParams.set("page", page);

    if (size) proxyUrl.searchParams.set("size", size);

    const proxyResponse = await fetchPublic(proxyUrl);

    if (proxyResponse.status === 403) {
      return new Response(null, { status: 403 });
    }

    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    return proxyFailureError(error);
  }
}
