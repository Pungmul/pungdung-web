import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "1";
    const size = searchParams.get("size") ?? "10";
    const proxyUrl = `${process.env.BASE_URL}/api/boards/hot?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`;

    const proxyResponse = await fetchWithRefresh(proxyUrl);

    return createValidatedUpstreamResponse(proxyResponse, {
      transformEnvelopeResponse: (innerResponse) => {
        if (
          innerResponse !== null &&
          typeof innerResponse === "object" &&
          "hotPosts" in innerResponse &&
          (innerResponse as { hotPosts: unknown }).hotPosts !== undefined
        ) {
          return (innerResponse as { hotPosts: unknown }).hotPosts;
        }

        return innerResponse;
      },
    });
  } catch (error) {
    return proxyFailureError(error);
  }
}
