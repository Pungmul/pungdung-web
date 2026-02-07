import { fetchWithRefresh, proxyFailureError } from "@/core/api/server";
export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await params;
    const body = await req.json();
    const proxyUrl = `${process.env.BASE_URL}/api/performances/${formId}/draft`;
    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
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
