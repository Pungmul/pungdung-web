import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const POST = async (req: Request) => {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/member/password`;

    const { currentPassword, newPassword } = await req.json();
    const response = await fetchWithRefresh(proxyUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, password: newPassword }),
    });
    return createValidatedUpstreamResponse(response);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
};
