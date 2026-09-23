import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { meetingId: rawMeetingId } = await params;
    const meetingId = Number(rawMeetingId);
    if (!Number.isInteger(meetingId) || meetingId <= 0) {
      return Response.json(
        {
          code: "INVALID_REQUEST",
          message: "잘못된 요청입니다.",
          response: null,
          isSuccess: false,
        },
        { status: 400 }
      );
    }

    const proxyUrl = `${process.env.BASE_URL}/api/lightning/${meetingId}`;
    const proxyResponse = await fetchWithRefresh(proxyUrl);
    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
