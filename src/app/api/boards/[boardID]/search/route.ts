import { fetchWithRefresh, proxyFailureError } from "@/core/api/server";
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

    if (!keyword) throw new Error("keyword is required");

    const proxyUrl = new URL(`${process.env.BASE_URL}/api/boards/search`);

    proxyUrl.searchParams.set("categoryId", boardID);
    proxyUrl.searchParams.set("keyword", keyword);

    if (page) proxyUrl.searchParams.set("page", page);

    if (size) proxyUrl.searchParams.set("size", size);

    const proxyResponse = await fetchWithRefresh(proxyUrl);

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const { response } = await proxyResponse.json();

    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
