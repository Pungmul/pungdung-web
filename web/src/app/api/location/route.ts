import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetchWithRefresh(
      `${process.env.BASE_URL}/api/location/my-location`
    );
    return await createValidatedUpstreamResponse(response);
  } catch (error) {
    return proxyFailureError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { latitude, longitude } = await req.json();
    const response = await fetchWithRefresh(
      `${process.env.BASE_URL}/api/location/update`,
      {
        method: "POST",
        body: JSON.stringify({ latitude, longitude }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await createValidatedUpstreamResponse(response);
  } catch (error) {
    return proxyFailureError(error);
  }
}
