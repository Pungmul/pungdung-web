import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const page = url.searchParams.get("page");
    const sizeRaw = url.searchParams.get("size");
    const sizeParsed = sizeRaw !== null ? Number(sizeRaw) : NaN;
    const size =
      Number.isFinite(sizeParsed) && sizeParsed > 0
        ? Math.floor(sizeParsed)
        : 10;

    const proxyUrl = new URL(`${process.env.BASE_URL}/api/comments/user`);

    proxyUrl.searchParams.set("page", page ?? "0");
    proxyUrl.searchParams.set("size", String(size));

    const proxyResponse = await fetchWithRefresh(proxyUrl);

    return createValidatedUpstreamResponse(proxyResponse, {
      transformEnvelopeResponse: (innerResponse) => {
        if (
          innerResponse !== null &&
          typeof innerResponse === "object" &&
          "comments" in innerResponse &&
          (innerResponse as { comments: unknown }).comments !== undefined
        ) {
          return (innerResponse as { comments: unknown }).comments;
        }

        return innerResponse;
      },
    });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
