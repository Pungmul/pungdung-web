import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";
export const dynamic = "force-dynamic";

//응답 {"code":"2001","message":"리소스가 성공적으로 생성되었습니다.","response":{"lightningMeetingId":708,"lightningMeetingName":"0521 그냥모임","organizerName":"강윤호"},"isSuccess":true}%
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await fetchWithRefresh(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/lightning/meeting`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    return await createValidatedUpstreamResponse(response);
  } catch (error) {
    console.error(error);
    return proxyFailureError(error, "번개 모임 생성에 실패했습니다.");
  }
}
