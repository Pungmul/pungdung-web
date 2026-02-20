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

    const keyword = url.searchParams.get("keyword");
    const page = url.searchParams.get("page");
    const size = url.searchParams.get("size");

    if (!keyword) {
      throw new Error("keyword is required");
    }

    const proxyUrl = new URL(`${process.env.BASE_URL}/api/boards/search`);

    proxyUrl.searchParams.set("categoryId", boardID);
    proxyUrl.searchParams.set("keyword", keyword);

    if (page) proxyUrl.searchParams.set("page", page);

    if (size) proxyUrl.searchParams.set("size", size);

    const proxyResponse = await fetchWithRefresh(proxyUrl);

    return createValidatedUpstreamResponse(proxyResponse, {
      transformEnvelopeResponse: (innerResponse) => {
        if (
          innerResponse !== null &&
          typeof innerResponse === "object" &&
          "searchPosts" in innerResponse &&
          (innerResponse as { searchPosts: unknown }).searchPosts !== undefined
        ) {
          return (innerResponse as { searchPosts: unknown }).searchPosts;
        }

        return innerResponse;
      },
    });
  } catch (error) {
    return proxyFailureError(error);
  }
}
