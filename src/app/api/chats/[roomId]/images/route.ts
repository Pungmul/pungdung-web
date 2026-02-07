import { fetchWithRefresh, proxyFailureError } from "@/core/api/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId: chatRoomUUID } = await params;

    const proxyUrl = `${process.env.BASE_URL}/api/chat/image/${chatRoomUUID}`;

    const formData = await req.formData();

    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "POST",
      body: formData,
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    return Response.json({ status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
//
