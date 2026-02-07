import { fetchWithRefresh, proxyFailureError } from "@/core/api/server";
export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;

    if (!postId) {
      return new Response("postId가 없습니다.", { status: 400 });
    }

    const { content, parentId, anonymity } = await req.json();

    const proxyUrl = parentId
      ? `${process.env.BASE_URL}/api/comments/${parentId}?postId=${postId}`
      : `${process.env.BASE_URL}/api/comments?postId=${postId}`;

    console.log(content, parentId, anonymity);

    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: !parentId
        ? JSON.stringify({ content, anonymity })
        : JSON.stringify({ content, parentId, anonymity }),
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const { response } = await proxyResponse.json();
    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
