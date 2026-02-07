import { fetchWithRefresh, proxyFailureError } from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ responseId: string }> }
) {
  try {
    const { responseId } = await params;
    if (!responseId) {
      return new Response("responseId가 없습니다.", { status: 400 });
    }
    const proxyUrl = `${process.env.BASE_URL}/api/performances/responses/${responseId}`;
    const proxyResponse = await fetchWithRefresh(proxyUrl);
    if (!proxyResponse.ok) {
      const errorText = await proxyResponse.text();
      console.log("서버 오류:", errorText);
      throw Error("서버 불안정" + proxyResponse.status);
    }
    const { response } = await proxyResponse.json();

    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ responseId: string }> }
) {
  try {
    const { responseId } = await params;
    const proxyUrl = `${process.env.BASE_URL}/api/performances/responses/${responseId}`;

    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "DELETE",
    });
    if (!proxyResponse.ok) {
      const errorText = await proxyResponse.text();
      console.log("서버 오류:", errorText);
      throw Error("서버 불안정" + proxyResponse.status);
    }
    const { response } = await proxyResponse.json();
    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
