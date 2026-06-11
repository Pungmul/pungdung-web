import { proxyFailureError } from "@/core/api/server";
export async function GET() {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/member/clubs`, {
      next: {
        revalidate: 60 * 60 * 1, // 1시간 캐시
      },
    });

    if (!response.ok) throw Error("서버 불안정" + response.status);

    const { response: data } = await response.json();

    return Response.json({ response: data });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}

// "clubInfoList": [
//             {
//                 "clubId": 1,
//                 "school": "상명대",
//                 "clubName": "어흥"
//             },
