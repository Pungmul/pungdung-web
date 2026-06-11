import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { fcmToken, deviceInfo } = await req.json();

    if (!fcmToken) throw Error("fcmToken is not exsist");
    if (!deviceInfo) throw Error("deviceInfo is not exsist");

    const proxyUrl = `${process.env.BASE_URL}/api/message/fcm/save`;
    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fcmToken, deviceInfo }),
    });

    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) throw Error("token is not exsist");

    const proxyUrl = `${process.env.BASE_URL}/api/message/fcm/token`;
    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
