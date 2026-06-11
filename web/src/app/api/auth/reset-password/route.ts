import {
  createValidatedUpstreamResponse,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/member/password/reset/confirm`;

    const { password, token } = await req.json();

    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newPassword: password, token }),
    });

    return createValidatedUpstreamResponse(response);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
