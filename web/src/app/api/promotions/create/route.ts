import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const proxyResponse = await fetchWithRefresh(
      `${process.env.BASE_URL}/api/performances`,
      { method: "POST" }
    );

    return createValidatedUpstreamResponse(proxyResponse, {
      transformEnvelopeResponse: (response) => {
        const formId =
          typeof response === "number"
            ? response
            : Number((response as { formId?: number }).formId);
        return { formId };
      },
    });
  } catch (error) {
    return proxyFailureError(error);
  }
}
