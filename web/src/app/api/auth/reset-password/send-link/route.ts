import {
  createValidatedUpstreamResponse,
  proxyFailureError,
} from "@/core/api/server";

export async function POST(req: Request) {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/member/password/reset/request`;

    const form = await req.json();

    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    return createValidatedUpstreamResponse(response);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
export const dynamic = "force-dynamic";
