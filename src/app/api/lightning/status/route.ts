import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";
export const dynamic = "force-dynamic";

// 응답 {"code":"2000","message":"성공","response":{"participant":false,"isOrganizer":null,"chatRoomUUID":null,"lightningMeeting":null},"isSuccess":true}%
export async function GET() {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/lightning/participation`;
    const proxyResponse = await fetchWithRefresh(proxyUrl);
    return await createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
