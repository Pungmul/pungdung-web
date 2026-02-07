import { fetchWithRefresh, proxyFailureError } from "@/core/api/server";
export const dynamic = "force-dynamic";

// export async function GET(req: Request) {
//   try {
//     const cookieStore = cookies();
//     const accessToken = cookieStore.get("accessToken")?.value;

//     if (!accessToken) throw Error("invalid Token");

//     const { fcmToken } = await req.json();

//     if (!fcmToken) throw Error("fcmToken is not exsist");

//     const proxyUrl = `${process.env.BASE_URL}/api/message/fcm/save`;

//     const response = await fetch(proxyUrl, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     if (!response.ok) throw Error("서버 불안정" + response.status);

//     // 프록시 응답 받기
//     const proxyResponse = await response.json();

//     // 클라이언트에 프록시 응답 반환
//     return Response.json(proxyResponse, { status: 200 });
//   } catch (error) {
//     console.error("프록시 처리 중 에러:", error);
//     return proxyFailureError(error);
//   }
// }

export async function POST(req: Request) {
  try {
    const { fcmToken, deviceInfo } = await req.json();

    if (!fcmToken) throw Error("fcmToken is not exsist");
    if (!deviceInfo) throw Error("deviceInfo is not exsist");

    const proxyUrl = `${process.env.BASE_URL}/api/message/fcm/save`;

    const response = await fetchWithRefresh(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fcmToken, deviceInfo }),
    });

    if (!response.ok) {
      const result = await response.text();
      console.log(result);
      throw Error("서버 불안정" + response.status);
    }
    // 프록시 응답 받기
    const proxyResponse = await response.json();

    // 클라이언트에 프록시 응답 반환
    return Response.json(proxyResponse, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
