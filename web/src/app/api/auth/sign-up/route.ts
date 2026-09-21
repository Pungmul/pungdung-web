import { cookies } from "next/headers";

import {
  createValidatedUpstreamResponse,
  proxyFailureError,
} from "@/core/api/server";

export async function POST(req: Request) {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/member/signup`;

    const form = await req.json();

    const formData = new FormData();
    const accountData = new Blob([JSON.stringify(form)], {
      type: "application/json",
    });
    formData.append("accountData", accountData);
    formData.append("profile", new Blob([], { type: "image/png" }));

    const response = await fetch(proxyUrl, {
      method: "POST",
      body: formData,
    });
    const proxyResponse = await createValidatedUpstreamResponse(response);
    const body = await proxyResponse.clone().json().catch(() => null);
    if (body?.isSuccess === true) {
      (await cookies()).delete("pendingInvitation");
    }
    return proxyResponse;
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
export const dynamic = "force-dynamic";
