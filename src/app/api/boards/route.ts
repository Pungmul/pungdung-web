import {
  createValidatedUpstreamResponse,
  proxyFailureError,
} from "@/core/api/server";

import { BOARD_INFO_LIST_REVALIDATE_SECONDS } from "@/features/board";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/boards`;
    const proxyResponse = await fetch(proxyUrl, {
      next: {
        revalidate: BOARD_INFO_LIST_REVALIDATE_SECONDS,
      },
    });
    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    return proxyFailureError(error);
  }
}
